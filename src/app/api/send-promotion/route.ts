import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { promises as fs } from 'fs';
import path from 'path';
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const subject = formData.get('subject') as string;
    const headline = formData.get('headline') as string;
    const imageFile = formData.get('image') as File;
    const targetGenre = formData.get('targetGenre') as string;

    if (!subject || !headline || !imageFile || !targetGenre) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    try {
        // 1. อัปโหลดรูปภาพ
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = `${Date.now()}-${imageFile.name}`;
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
        const imagePath = path.join(uploadsDir, filename);
        await fs.writeFile(imagePath, imageBuffer);
        const imageUrl = `/uploads/${filename}`;

        // 2. สร้างเงื่อนไข (Condition) สำหรับค้นหา
        let whereClause: Prisma.EmailSubscriberWhereInput = {};
        if (targetGenre && targetGenre !== "All") {
            whereClause = { favoriteGenre: targetGenre };
        }
        
        // 3. ค้นหา Subscribers ที่ตรงตามเงื่อนไข
        const subscribers = await prisma.emailSubscriber.findMany({
            where: whereClause,
            select: { email: true },
        });

        if (subscribers.length === 0) {
            return NextResponse.json({ message: "No subscribers found for this genre.", sentCount: 0 });
        }
        const emails = subscribers.map(s => s.email);

        // 4. ทำงานอัตโนมัติ (Action) คือส่งอีเมลหาทุกคนใน List
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        for (const email of emails) {
            await transporter.sendMail({
                from: `"KeyHub" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: subject,
                html: `
                    <div style="text-align: center; font-family: sans-serif;">
                        <h1>${headline}</h1>
                        <p>Check out our latest promotion!</p>
                        <img src="${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl}" alt="Promotion" style="max-width: 100%;" />
                    </div>
                `,
            });
        }
        
        return NextResponse.json({ message: "Promotion sent successfully!", sentCount: emails.length });

    } catch (error: any) {
        console.error("Failed to send promotion:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}