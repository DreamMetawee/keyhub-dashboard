'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * ลบอีเมลผู้สมัครรับข่าวสารออกจากฐานข้อมูล
 * @param formData ข้อมูล Form ที่มี hidden input ชื่อ 'subscriberId'
 */
export async function deleteSubscriber(formData: FormData) {
  const subscriberId = formData.get('subscriberId') as string;

  try {
    await prisma.emailSubscriber.delete({
      where: { id: subscriberId },
    });
    
    // 💡 รีโหลดหน้า Admin เพื่อให้เห็นการเปลี่ยนแปลง
    revalidatePath('/admin/subscribers'); 
    return { success: true, message: `Email ${subscriberId.substring(0, 8)}... unsubscribed successfully.` };
  } catch (e) {
    console.error('Delete Subscriber Error:', e);
    return { error: 'Failed to delete subscriber. Database error.' };
  }
}