// src/app/api/keys/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// [POST] เพิ่มคีย์จำนวนมาก (Bulk Import)
export async function POST(request: Request) {
    try {
        const { gameId, keysList } = await request.json(); // keysList คือ string ที่คั่นด้วย \n

        if (typeof gameId !== 'number' || !keysList) {
            return NextResponse.json({ error: 'Missing game ID or keys list.' }, { status: 400 });
        }

        const keysArray = keysList.split('\n').map((key: string) => key.trim()).filter((key: string) => key.length > 0);

        const dataToCreate = keysArray.map((key: string) => ({
            key: key,
            gameId: gameId,
            status: 'Available',
        }));

        const result = await prisma.gameKey.createMany({
            data: dataToCreate,
            skipDuplicates: true,
        });

        return NextResponse.json({ message: `${result.count} key(s) added.`, count: result.count }, { status: 201 });
    } catch (error) {
        console.error('POST Add Keys API Error:', error);
        return NextResponse.json({ error: 'Failed to import keys.' }, { status: 500 });
    }
}

// [DELETE] ลบคีย์เดียว (โดยส่ง ID ผ่าน Body)
export async function DELETE(request: Request) {
    try {
        const { keyId } = await request.json(); // คาดหวัง keyId เป็น String
        
        const key = await prisma.gameKey.findUnique({ where: { id: keyId } });
        if (!key) {
            return NextResponse.json({ error: 'Key not found.' }, { status: 404 });
        }
        if (key.status !== 'Available') {
            return NextResponse.json({ error: 'Cannot delete a key that has been sold.' }, { status: 403 });
        }

        await prisma.gameKey.delete({
            where: { id: keyId },
        });

        return NextResponse.json({ message: 'Key deleted successfully.' });
    } catch (error) {
        console.error('DELETE Key API Error:', error);
        return NextResponse.json({ error: 'Failed to delete key.' }, { status: 500 });
    }
}