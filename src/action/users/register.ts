'use server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

/**
 * ลงทะเบียนผู้ใช้ใหม่
 * @param formData ข้อมูล Form ที่มี email และ password
 */
export async function register(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password || !name) {
    return { error: 'All fields are required for registration.' };
  }
  
  // 1. เข้ารหัสรหัสผ่าน
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 2. สร้างผู้ใช้ในฐานข้อมูล
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // ใช้รหัสผ่านที่ถูกเข้ารหัส
      },
    });
    
    // 3. (Optional) Redirect ไปหน้า Login หลังจากสมัครสำเร็จ
    // ถ้าคุณใช้ NextAuth หรือ Auth Solution อื่น ๆ, การ Redirect จะถูกจัดการใน Logic นั้น
    redirect('/login?success=registered');
    
  } catch (e) {
    console.error('Registration Error:', e);
    // P2002: Email ซ้ำ
    if (typeof e === 'object' && e !== null && 'code' in e && (e as any).code === 'P2002') {
        return { error: 'This email is already registered.' };
    }
    return { error: 'Failed to create account.' };
  }
}