'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * ลบเกมตาม ID ที่ได้รับจาก FormData (ผ่าน hidden input)
 * @param formData ข้อมูล Form ที่ต้องมี hidden input ชื่อ 'gameId'
 */
export async function deleteGame(formData: FormData) {
  
  // 1. ดึงค่า gameId จาก hidden input (เป็น string)
  const gameIdString = formData.get('gameId') as string;
  const gameId = parseInt(gameIdString); 
  
  if (isNaN(gameId)) {
      return { error: 'Invalid Game ID provided. ID must be a number.' };
  }

  try {
    // 1. ลบคีย์เกมที่ยัง Available ทิ้งไปก่อน (ป้องกัน Foreign Key Constraint)
    await prisma.gameKey.deleteMany({
      where: { gameId: gameId, status: 'Available' },
    });
    
    // 2. ลบเกมหลัก
    await prisma.game.delete({
      where: { id: gameId },
    });

    revalidatePath('/dashboard/games');
    return { success: true, message: 'Game and its available keys deleted successfully.' };
  } catch (e) {
    console.error('Delete Game Error:', e);
    
    // การจัดการ Error Code ที่ใช้ TypeScript-safe
    if (typeof e === 'object' && e !== null && 'code' in e) {
      const errorCode = (e as { code: string }).code;
      if (errorCode === 'P2003') {
        return { error: 'Cannot delete game. It still has associated sold keys or active items.' };
      }
      if (errorCode === 'P2025') {
        return { error: 'Game not found.' };
      }
    }
    return { error: 'An unexpected error occurred during game deletion.' };
  }
}