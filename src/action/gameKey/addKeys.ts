'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * เพิ่มคีย์เกมใหม่เข้าสู่ระบบหลายรายการพร้อมกัน
 * @param gameId ID ของเกมที่คีย์เหล่านี้สังกัด
 * @param formData ข้อมูล Form ที่มี field 'keysList' (คีย์ที่คั่นด้วยบรรทัดใหม่)
 */
export async function addGameKeys(gameId: number, formData: FormData) {
  const keysList = formData.get('keysList') as string;

  if (!keysList) {
    return { error: 'Please enter at least one game key.' };
  }

  // แยกคีย์แต่ละบรรทัดออกเป็น Array และลบช่องว่าง/บรรทัดว่าง
  const keysArray = keysList
    .split('\n')
    .map(key => key.trim())
    .filter(key => key.length > 0);

  if (keysArray.length === 0) {
    return { error: 'No valid keys found after cleaning the input.' };
  }

  // สร้างรายการข้อมูลสำหรับ Prisma
  const dataToCreate = keysArray.map(key => ({
    key: key,
    gameId: gameId,
    status: 'Available', // ตั้งสถานะเริ่มต้นเป็น 'Available'
  }));

  try {
    // ใช้ createMany เพื่อสร้างหลายรายการพร้อมกัน (ประสิทธิภาพดี)
    const result = await prisma.gameKey.createMany({
      data: dataToCreate,
      skipDuplicates: true, // ข้ามคีย์ที่ซ้ำกันหากมีอยู่ในฐานข้อมูลแล้ว
    });

    revalidatePath(`/dashboard/games/${gameId}/keys`); // รีเฟรชหน้าจัดการคีย์ของเกมนั้น
    return { 
      success: true, 
      message: `${result.count} new key(s) added successfully.`,
      count: result.count
    };
  } catch (e) {
    console.error('Add Game Keys Error:', e);
    // ข้อผิดพลาดอาจเกิดจาก gameId ไม่ถูกต้อง หรือเกิดปัญหาเชื่อมต่อ
    return { error: 'Failed to add game keys. Check if Game ID is valid.' };
  }
}