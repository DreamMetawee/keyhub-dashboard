'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * แก้ไขข้อมูลเกมตาม ID
 * @param gameId ID ของเกมที่ต้องการแก้ไข
 * @param formData ข้อมูล Form ที่มี title, slug, price, discount, imageUrl, category
 */
export async function updateGame(gameId: number, formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const price = parseFloat(formData.get('price') as string);
  const discount = parseFloat(formData.get('discount') as string) || 0;
  const imageUrl = formData.get('imageUrl') as string;
  const category = formData.get('category') as string;

  if (!title || !slug || isNaN(price)) {
    return { error: 'Missing required fields or invalid price.' };
  }
  
  try {
    await prisma.game.update({
      where: { id: gameId },
      data: {
        title,
        slug,
        price,
        discount,
        imageUrl,
        category,
      },
    });
    revalidatePath('/dashboard/games'); 
    revalidatePath(`/dashboard/games/${gameId}/edit`); 
    return { success: true, message: `Game "${title}" updated successfully.` };
  } catch (e) {
    console.error('Update Game Error:', e);
    if (typeof e === 'object' && e !== null && 'code' in e) {
      const errorWithCode = e as { code: string };
      if (errorWithCode.code === 'P2002') {
        return { error: 'Failed to update game. Slug already exists.' };
      }
      if (errorWithCode.code === 'P2025') {
        return { error: 'Game not found.' };
      }
    }
    return { error: 'An unexpected error occurred during game update.' };
  }
}