// src/app/api/game/[slug]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;

    // ✅ ใช้ชื่อ relation ที่ถูกต้อง คือ gameKeys
    const game = await prisma.game.findUnique({
      where: { slug },
      include: {
        gameKeys: true, // ✅ ใช้ชื่อ relation ตาม schema
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({
      gameDetails: {
        title: game.title,
        imageUrl: game.imageUrl,
        category: game.category,
        price: game.price,
      },
      availableStock: game.gameKeys.filter((k) => k.status === "Available").length,
      keys: game.gameKeys.map((k) => ({
        id: k.id,
        keyCode: k.key, // ✅ ใช้ field ที่ถูกต้อง (ใน schema คุณใช้ชื่อ key)
        isUsed: k.status !== "Available",
      })),
    });
  } catch (error) {
    console.error("GET Game By Slug API Error:", error);
    return NextResponse.json({ error: "Failed to fetch game details." }, { status: 500 });
  }
}
