// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// [GET] ดึงรายการผู้ใช้ทั้งหมด
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
    }
}

// [DELETE] ลบผู้ใช้ (สำหรับ Admin/Dashboard)
export async function DELETE(request: Request) {
    try {
        const { userId } = await request.json();

        // 💡 ตรวจสอบว่ามีการตั้งค่า onDelete: Cascade ใน Schema เพื่อจัดการ Orders/Subs
        await prisma.user.delete({
            where: { id: userId },
        });
        
        return NextResponse.json({ message: 'User account deleted.' });
    } catch (e: any) {
         if (e.code === 'P2025') {
            return NextResponse.json({ error: 'User not found for deletion.' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
    }
}