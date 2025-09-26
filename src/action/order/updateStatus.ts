'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const VALID_STATUSES = ['Pending', 'Processing', 'Completed', 'Cancelled', 'Refunded'];

/**
 * อัปเดตสถานะของคำสั่งซื้อ
 * @param orderId ID ของคำสั่งซื้อ
 * @param newStatus สถานะใหม่ที่ต้องการตั้ง
 */
export async function updateOrderStatus(orderId: string, newStatus: string) {
  if (!VALID_STATUSES.includes(newStatus)) {
    return { error: `Invalid status provided: ${newStatus}` };
  }
  
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: { items: { include: { gameKey: true } } }, // ดึงข้อมูลคีย์มาด้วย
    });

    // *** Logic สำคัญ: การจัดการ GameKey เมื่อ Order ถูก 'Completed' ***
    if (newStatus === 'Completed') {
        // หาก OrderItem มีการเชื่อมโยงกับ GameKey แล้ว สถานะ Key จะถูกจัดการโดยระบบ Order Fulfilment
        // แต่ถ้ายังไม่เชื่อมโยง (เป็นสถานะที่ไม่ควรเกิด) อาจต้องใส่ logic แจกคีย์ตรงนี้
    }
    
    // Revalidate หน้ารายการคำสั่งซื้อ
    revalidatePath('/dashboard/orders');
    return { success: true, message: `Order ${orderId.substring(0, 8)} status updated to ${newStatus}.` };
  } catch (e) {
    console.error('Update Order Status Error:', e);
    return { error: 'Failed to update order status. Order ID might be incorrect.' };
  }
}