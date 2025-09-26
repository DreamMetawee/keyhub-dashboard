'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * บันทึกอีเมลของผู้ใช้ที่สมัครรับข่าวสาร
 * @param formData ข้อมูล Form ที่มี field 'email' และ 'source'
 */
export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;
  const source = formData.get('source') as string || 'General Signup'; // ค่าเริ่มต้น

  if (!email || !email.includes('@')) {
    return { error: 'Invalid email address provided.' };
  }

  try {
    await prisma.emailSubscriber.create({
      data: {
        email: email,
        source: source,
      },
    });
    // Revalidate หน้าที่มีการแสดงผลจำนวนผู้ติดตาม (เช่น Dashboard Overview)
    revalidatePath('/dashboard'); 
    return { success: true, message: 'Successfully subscribed to the newsletter!' };
  } catch (e) {
    // อาจจะเกิดข้อผิดพลาดเนื่องจากอีเมลซ้ำ (@unique)
    if (typeof e === 'object' && e !== null && 'code' in e && (e as any).code === 'P2002') {
        return { error: 'This email is already subscribed.' };
    }
    console.error('Subscription Error:', e);
    return { error: 'Failed to process subscription.' };
  }
}