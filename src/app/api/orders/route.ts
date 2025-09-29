// file: /api/orders/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  // 1. รับแค่ 'items' อย่างเดียว
  const { items } = await request.json(); 

  // 2. ตรวจสอบแค่ 'items'
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: 'Cart items are required' }, { status: 400 });
  }

  try {
    const newOrder = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        const game = await tx.game.findUnique({ where: { id: item.productId } });
        if (!game) throw new Error(`Product with ID ${item.productId} not found.`);
        
        const availableKeys = await tx.gameKey.findMany({
          where: { gameId: item.productId, status: "Available" },
          take: item.quantity,
        });

        if (availableKeys.length < item.quantity) {
          throw new Error(`Not enough stock for "${game.title}".`);
        }

        for (const key of availableKeys) {
          totalAmount += game.price;
          orderItemsToCreate.push({
            gameId: game.id,
            gameKeyId: key.id,
            quantity: 1,
            pricePaid: game.price,
          });
          await tx.gameKey.update({
            where: { id: key.id },
            data: { status: 'Sold' },
          });
        }
      }

      // 3. สร้าง Order โดย "ไม่ใส่" userId
      const order = await tx.order.create({
        data: {
          // userId: undefined, // ไม่ต้องมีบรรทัดนี้เลย
          totalAmount: totalAmount,
          status: 'Completed',
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: {
            include: {
              game: true,
              gameKey: true,
            },
          },
        },
      });

      return order;
    });

    return NextResponse.json(newOrder, { status: 201 });

  } catch (error) {
    console.error("Order creation failed:", error);
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}