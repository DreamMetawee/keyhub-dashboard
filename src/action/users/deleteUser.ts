'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * ลบบัญชีผู้ใช้ (สำหรับ Admin) พร้อมลบ Subscription ที่เกี่ยวข้อง
 * @param userId ID ของผู้ใช้
 */
export async function deleteUser(userId: string) {
  try {
    const numericId = Number(userId);

    // ตรวจสอบก่อนว่าผู้ใช้มี subscription อยู่หรือไม่
    const subsCount = await prisma.subscription.count({
      where: { userId: numericId },
    });

    if (subsCount > 0) {
      // ลบ subscription ที่เชื่อมกับ user ก่อน
      await prisma.subscription.deleteMany({
        where: { userId: numericId },
      });
    }

    // ถ้ามี orders ก็ลบด้วย (ถ้ามีตาราง order)
    await prisma.order.deleteMany({ where: { userId: numericId } });

    // ลบผู้ใช้
    await prisma.user.delete({ where: { id: numericId } });

    revalidatePath('/dashboard/users');

    return { success: true, message: `User ${userId.substring(0, 8)}... deleted.` };
  } catch (e) {
    console.error('Delete User Error:', e);
    return {
      error: 'Failed to delete user. Check connected orders or subscriptions.',
    };
  }
}
