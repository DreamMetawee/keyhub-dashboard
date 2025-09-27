// Backend Project: src/app/api/games/hero/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// [GET] ดึงเกมเด่นที่สุด (เช่น เกมล่าสุด หรือเกมที่มีราคาสูงสุด)
export async function GET() {
    try {
        const game = await prisma.game.findFirst({
            orderBy: { createdAt: 'desc' }, // หรือ orderBy: { price: 'desc' }
            select: { id: true, title: true, slug: true, price: true, discount: true, imageUrl: true, category: true },
        });

        if (!game) {
            return NextResponse.json({ error: 'No games found.' }, { status: 404 });
        }
        return NextResponse.json(game);
    } catch (error) {
        console.error('GET Hero Game API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch hero game.' }, { status: 500 });
    }
}