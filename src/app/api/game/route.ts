// src/app/api/games/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 💡 ใช้ Prisma Client
import Cors from "cors"


// [GET] ดึงรายการเกมทั้งหมด
export async function GET() {
    try {
        const games = await prisma.game.findMany({
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, slug: true, price: true, discount: true, imageUrl: true, category: true }
        });
        return NextResponse.json(games);
    } catch (error) {
        console.error('GET Games API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch games list.' }, { status: 500 });
    }
}

// [POST] สร้างเกมใหม่
export async function POST(request: Request) {
    try {
        const { title, slug, price, discount, imageUrl, category } = await request.json();

        if (!title || !slug || typeof price !== 'number') {
            return NextResponse.json({ error: 'Missing required data.' }, { status: 400 });
        }

        const newGame = await prisma.game.create({
            data: { title, slug, price, discount: discount || 0, imageUrl, category },
        });

        return NextResponse.json(newGame, { status: 201 });
    } catch (e: any) {
        // P2002: Unique constraint failed (Slug ซ้ำ)
        if (e.code === 'P2002') {
            return NextResponse.json({ error: 'Game slug already exists.' }, { status: 409 });
        }
        console.error('POST Create Game API Error:', e);
        return NextResponse.json({ error: 'Failed to create game.' }, { status: 500 });
    }
}