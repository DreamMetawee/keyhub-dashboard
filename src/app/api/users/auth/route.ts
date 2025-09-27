// src/app/api/users/auth/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// [POST] สำหรับ Register หรือ Login (รวม 2 ฟังก์ชันใน Endpoint เดียวเพื่อความง่าย)
export async function POST(request: Request) {
    try {
        const { action, email, password, name } = await request.json();

        if (action === 'register') {
            if (!email || !password || !name) {
                return NextResponse.json({ error: 'Missing fields for registration.' }, { status: 400 });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            
            await prisma.user.create({
                data: { name, email, password: hashedPassword },
            });
            return NextResponse.json({ success: true, message: 'Registration successful.' }, { status: 201 });
        } 
        
        if (action === 'login') {
            if (!email || !password) {
                return NextResponse.json({ error: 'Email and password required.' }, { status: 400 });
            }
            const user = await prisma.user.findUnique({ where: { email } });
            
            if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
                return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
            }
            
            // 💡 ในการใช้งานจริง: ควรสร้าง JWT (Token) หรือ Session ID ที่นี่
            return NextResponse.json({ success: true, userId: user.id }, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid action specified.' }, { status: 400 });
    } catch (e: any) {
        if (e.code === 'P2002') {
            return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
        }
        console.error('Auth API Error:', e);
        return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
}