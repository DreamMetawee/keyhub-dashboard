'use server';
import prisma from '@/lib/prisma';

/**
 * ดึงรายการคีย์ทั้งหมดสำหรับเกมที่กำหนด
 * @param gameId ID ของเกม
 */
export async function getKeysByGameId(gameId: number) {
  return prisma.gameKey.findMany({
    where: { gameId: gameId },
    orderBy: { id: 'desc' }, // เรียงตามเวลาที่สร้างล่าสุด
  });
}