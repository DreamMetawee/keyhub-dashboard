// D:\Digital_Maarketing\KeyHub\free-nextjs-admin-dashboard-main\src\app\api\orders\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const { items } = await request.json();
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json({ message: "กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ" }, { status: 401 });
    }

    let userId: number;
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        userId = decoded.id;
    } catch (err) {
        return NextResponse.json({ message: "Token ไม่ถูกต้อง" }, { status: 401 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ message: 'Cart items are required' }, { status: 400 });
    }

    try {
        const createdOrder = await prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            const orderItemsToCreate = [];
            const aggregatedCart = new Map<number, { quantity: number }>();

            for (const item of items) {
                const existingItem = aggregatedCart.get(item.productId) || { quantity: 0 };
                existingItem.quantity += item.quantity;
                aggregatedCart.set(item.productId, existingItem);
            }

            for (const [productId, itemData] of aggregatedCart.entries()) {
                const { quantity } = itemData;
                const game = await tx.game.findUnique({ where: { id: productId } });
                if (!game) throw new Error(`Product with ID ${productId} not found.`);

                const availableKeys = await tx.gameKey.findMany({
                    where: { gameId: productId, status: "Available" },
                    take: quantity,
                    select: { id: true, key: true }
                });

                if (availableKeys.length < quantity) {
                    throw new Error(`Not enough stock for "${game.title}".`);
                }

                const keyIdsToClaim = availableKeys.map(k => k.id);
                const updateResult = await tx.gameKey.updateMany({
                    where: { id: { in: keyIdsToClaim }, status: 'Available' },
                    data: { status: 'Sold' }
                });

                if (updateResult.count < quantity) {
                    throw new Error(`Failed to reserve stock for "${game.title}". Please try again.`);
                }

                for (const key of availableKeys) {
                    totalAmount += game.price;
                    orderItemsToCreate.push({
                        gameId: game.id,
                        gameKeyId: key.id,
                        quantity: 1,
                        pricePaid: game.price,
                    });
                }
            }

            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    status: 'Completed',
                    items: { create: orderItemsToCreate },
                },
            });

            return order;
        });

        // ✅ ดึงข้อมูลเพื่อส่งอีเมล
        const fullOrderDetails = await prisma.order.findUnique({
            where: { id: createdOrder.id },
            include: {
                user: true,
                items: { include: { game: true, gameKey: true } },
            },
        });

        if (fullOrderDetails && fullOrderDetails.user) {
            try {
                // ✅ ตั้งค่า Nodemailer
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS, // ต้องใช้ App Password
                    },
                });

                await transporter.sendMail({
                    from: `"KeyHub" <${process.env.EMAIL_USER}>`,
                    to: fullOrderDetails.user.email,
                    subject: `🎮 Your Game Keys from Order #${fullOrderDetails.id.substring(0, 8)}`,
                    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: Arial, sans-serif; margin:0; padding:0; background:#f4f6f8; color:#0f172a; }
        .container { max-width:600px; margin:20px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08); }
        .header { background:#2563eb; color:#fff; text-align:center; padding:20px; }
        .header h1 { margin:0; font-size:22px; }
        .content { padding:24px; }
        .game-item { margin-bottom:16px; padding:12px; border:1px solid #e2e8f0; border-radius:6px; background:#f9fafb; }
        .game-item h3 { margin:0 0 4px 0; font-size:16px; color:#1e293b; }
        .game-item p { margin:0; font-size:14px; color:#334155; word-break:break-all; }
        .btn { display:inline-block; padding:14px 24px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold; margin-top:16px; }
        .footer { background:#0f172a; color:#94a3b8; text-align:center; font-size:12px; padding:16px; }
        .promo-img { width:100%; max-width:560px; border-radius:6px; margin:12px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank you for your purchase, ${fullOrderDetails.user.name}! 🎉</h1>
        </div>
        <div class="content">
          <p>Here are your game keys from your order:</p>

          ${fullOrderDetails.items.map(item => `
            <div class="game-item">
              <h3>${item.game.title}</h3>
              <p><strong>${item.gameKey.key}</strong></p>
            </div>
          `).join('')}

          <!-- Promotion / Logo image -->
          <img src="cid:promoImage" alt="Promotion" class="promo-img" />
          <p style="margin-top:16px; font-size:13px; color:#64748b;">
            If you no longer wish to receive promotional emails, you can unsubscribe anytime at <a href="${process.env.SITE_URL ?? '#'}" style="color:#2563eb;">here</a>.
          </p>
        </div>
        <div class="footer">
          KeyHub • Bangkok, Thailand<br/>
          <a href="mailto:support@keyhub.example" style="color:#94a3b8;">support@keyhub.example</a>
        </div>
      </div>
    </body>
    </html>
  `,
                    attachments: [
                        {
                            filename: "newCustomer.png",
                            path: "D:/Digital_Maarketing/KeyHub/free-nextjs-admin-dashboard-main/public/uploads/promotion bundle.png", // เปลี่ยนเป็น path จริงของไฟล์คุณ
                            cid: "promoImage" // ต้องตรงกับ src ของ <img>
                        }
                    ]
                });


                console.log("✅ Email sent to:", fullOrderDetails.user.email);
            } catch (emailError) {
                console.error("❌ Failed to send email:", emailError);
            }
        }

        return NextResponse.json(createdOrder, { status: 201 });

    } catch (error) {
        console.error("Order creation failed:", error);
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
