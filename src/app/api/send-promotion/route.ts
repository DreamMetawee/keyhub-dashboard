import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const subject = formData.get("subject") as string;
  const headline = formData.get("headline") as string;
  const imageFile = formData.get("image") as File;
  const targetGenre = formData.get("targetGenre") as string;

  if (!subject || !headline || !imageFile || !targetGenre) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  try {
    // 1. Save uploaded image to /public/uploads
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const filename = `${Date.now()}-${imageFile.name}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const imagePath = path.join(uploadsDir, filename);
    await fs.writeFile(imagePath, imageBuffer);

    // 2. Find subscribers
    let whereClause: Prisma.EmailSubscriberWhereInput = {};
    if (targetGenre && targetGenre !== "All") {
      whereClause = { favoriteGenre: targetGenre };
    }

    const subscribers = await prisma.emailSubscriber.findMany({
      where: whereClause,
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({
        message: "No subscribers found for this genre.",
        sentCount: 0,
      });
    }

    const emails = subscribers.map((s) => s.email);

    // 3. Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 4. Send email with inline attachment
    for (const email of emails) {
      await transporter.sendMail({
        from: `"KeyHub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 30px; text-align: center;">
            <div style="background: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <h1 style="color: #4A90E2; margin-bottom: 15px;">${headline}</h1>
              <p style="font-size: 16px; color: #333;">Check out our latest promotion just for you 🎮</p>
              <img src="cid:promoImage" alt="Promotion" style="max-width: 100%; border-radius: 8px; margin: 20px 0;" />
              <a href="https://sites.google.com/udru.ac.th/keyhub?usp=sharing" 
                 style="display:inline-block; padding:12px 20px; background:#4A90E2; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
                Visit KeyHub
              </a>
              <p style="margin-top:20px; font-size:12px; color:#888;">You are receiving this email because you subscribed to KeyHub.</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: filename,
            path: imagePath, // ใช้ path จริงจากที่ save ไว้
            cid: "promoImage", // ต้องตรงกับใน <img src="cid:promoImage">
          },
        ],
      });
    }

    return NextResponse.json({
      message: "Promotion sent successfully!",
      sentCount: emails.length,
    });
  } catch (error: any) {
    console.error("Failed to send promotion:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
