// Backend Project: src/app/api/games/[slug]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// [GET] ดึงข้อมูลเกมเดียวตาม SLUG
export async function GET(request: Request, { params }: { params: { slug: string } }) {
    const { slug } = params;

    try {
        const game = await prisma.game.findUnique({
            where: { slug: slug },
            // 💡 ถ้าคุณต้องการแสดงราคาของ Key ที่มีอยู่ในคลัง (Available Keys) 
            // อาจต้องเพิ่ม Logic การค้นหา/เปรียบเทียบราคาคีย์ที่นี่ หรือในตาราง GameKey/Order
        });

        if (!game) {
            return NextResponse.json({ error: 'Game not found.' }, { status: 404 });
        }
        
        // 💡 [Mocking Seller Data]: เนื่องจากคุณไม่มีตาราง Seller และ Key Prices
        // ใน Schema เราจึงต้องส่งข้อมูลเกมหลัก และอาจจะส่ง Key Stock ที่ Available กลับไป
        const availableKeysCount = await prisma.gameKey.count({
            where: { gameId: game.id, status: 'Available' }
        });


        // 📢 ในสถานการณ์จริง คุณต้องมีตารางสำหรับ "ผู้ขาย" และ "รายการขาย" 
        // เพื่อดึงข้อมูลราคาที่แตกต่างกันมาแสดงผล
        // สำหรับตอนนี้ เราจะส่งข้อมูลหลักของเกมและ Mock ข้อมูล Seller กลับไป
        
        return NextResponse.json({
            gameDetails: game,
            availableStock: availableKeysCount,
            // (คุณอาจต้องเพิ่ม Logic ดึงรายการ Keys และราคาที่แท้จริงจาก DB ที่นี่)
            
            // เพื่อให้ Frontend ทำงานได้ต่อ เราจะส่ง Mock Seller Data กลับไป
            mockSellerData: [
                 { seller: "Official Store", price: game.price * 1.05, region: "GLOBAL", platform: "Standard" },
                 { seller: "Kinguin", price: game.price * 0.95, region: "EU", platform: "Standard" },
                 { seller: "HRK Game", price: game.price * 0.98, region: "EU", platform: "Premium" },
            ]
        });
    } catch (error) {
        console.error('GET Game By Slug API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch game details.' }, { status: 500 });
    }
}