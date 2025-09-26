'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * อัปเดตสถานะของคีย์เกมตัวใดตัวหนึ่ง
 * @param keyId ID ของ GameKey ที่ต้องการแก้ไขสถานะ
 * @param newStatus สถานะใหม่ (เช่น 'Available', 'Sold', 'Inactive')
 * @param gameId ID ของเกม (ใช้สำหรับ revalidation path)
 */
export async function updateGameKeyStatus(keyId: string, newStatus: string, gameId: number) {
  // ตรวจสอบสถานะที่ยอมรับได้
  const validStatuses = ['Available', 'Sold', 'Inactive'];
  if (!validStatuses.includes(newStatus)) {
    return { error: `Invalid status: ${newStatus}` };
  }

  try {
    await prisma.gameKey.update({
      where: { id: keyId },
      data: { status: newStatus },
    });

    revalidatePath(`/dashboard/games/${gameId}/keys`);
    return { success: true, message: `Key status updated to ${newStatus}.` };
  } catch (e) {
    console.error('Update Key Status Error:', e);
    return { error: 'Failed to update game key status. Key ID might be incorrect.' };
  }
}