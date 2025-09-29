// src/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ปรับ path ให้ตรงกับไฟล์ prisma client ของคุณ

interface Params {
  params: {
    id: number;
  };
}

// --- GET /api/users/:id ---
export async function GET(req: Request, { params }: Params) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- PUT /api/users/:id ---
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: body, // body ต้องมี key ที่ตรงกับ field ใน user table
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- DELETE /api/users/:id ---
export async function DELETE(req: Request, { params }: Params) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
