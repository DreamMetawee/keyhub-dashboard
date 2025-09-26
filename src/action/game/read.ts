'use server';
import prisma from '@/lib/prisma';

/**
 * ดึงข้อมูลเกมเดียวตาม ID
 * @param id ID ของเกม (เป็น number)
 */
export async function getGameById(id: number) {
  // ใช้ findUnique เพื่อดึงข้อมูลเกมเดียว
  return prisma.game.findUnique({
    where: { id: id },
  });
}