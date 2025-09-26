'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * อัปเดตข้อมูลส่วนตัวของผู้ใช้ (สำหรับหน้า Admin หรือ Profile)
 * @param userId ID ของผู้ใช้
 * @param formData ข้อมูล Form ที่มี field 'name' และ 'email'
 */
export async function updateProfile(userId: string, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  if (!name || !email) {
    return { error: 'Name and Email are required.' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });
    revalidatePath(`/dashboard/users/${userId}`); // รีเฟรชหน้า Profile
    return { success: true, message: 'User profile updated successfully.' };
  } catch (e) {
    // P2002: Email ซ้ำ
    if (typeof e === 'object' && e !== null && 'code' in e && (e as any).code === 'P2002') {
        return { error: 'This email is already in use by another account.' };
    }
    console.error('Update Profile Error:', e);
    return { error: 'Failed to update profile.' };
  }
}