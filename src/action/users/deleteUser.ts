'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * ลบบัญชีผู้ใช้ (สำหรับ Admin)
 * @param userId ID ของผู้ใช้ที่ต้องการลบ
 */
export async function deleteUser(userId: string) {
  try {
    // หมายเหตุ: หากผู้ใช้มีการสั่งซื้อหรือ Subscription ที่เชื่อมโยงอยู่ 
    // คุณต้องแน่ใจว่าได้ตั้งค่า onDelete: Cascade ใน schema.prisma 
    // หรือจัดการความสัมพันธ์ก่อนลบ
    
    await prisma.user.delete({
      where: { id: userId },
    });
    
    revalidatePath('/dashboard/users');
    return { success: true, message: `User ${userId.substring(0, 8)}... deleted.` };
  } catch (e) {
    console.error('Delete User Error:', e);
    return { error: 'Failed to delete user. Check connected orders or subscriptions.' };
  }
}