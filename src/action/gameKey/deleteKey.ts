'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * ลบคีย์เกมตัวใดตัวหนึ่งออกจากคลัง
 * @param keyId ID ของ GameKey ที่ต้องการลบ (ใช้ String ตาม Schema)
 * @param gameId ID ของเกม (ใช้สำหรับ revalidation path)
 */
export async function deleteGameKey(keyId: string, gameId: number) {
  try {
    const key = await prisma.gameKey.findUnique({ where: { id: keyId } });

    if (!key) {
      return { error: 'Game key not found.' };
    }
    
    // ป้องกันการลบคีย์ที่ถูกขายไปแล้ว
    if (key.status !== 'Available') {
      return { error: 'Cannot delete a key that is not in "Available" status.' };
    }

    await prisma.gameKey.delete({
      where: { id: keyId },
    });

    revalidatePath(`/dashboard/games/${gameId}/keys`);
    return { success: true, message: `Key ${keyId.substring(0, 8)}... deleted successfully.` };
  } catch (e) {
    console.error('Delete Game Key Error:', e);
    return { error: 'Failed to delete game key.' };
  }
}