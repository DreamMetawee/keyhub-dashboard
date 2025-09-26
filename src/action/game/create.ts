'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * สร้างเกมใหม่ในฐานข้อมูล
 * @param formData ข้อมูล Form ที่มี title, slug, price, discount, imageUrl, category
 */
export async function createGame(formData: FormData) {
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
    await prisma.game.create({
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
    return { success: true, message: `Game "${title}" created successfully.` };
  } catch (e) {
    console.error('Create Game Error:', e);
    // P2002: Unique constraint failed (อาจเป็น slug ซ้ำ)
    if (typeof e === 'object' && e !== null && 'code' in e && (e as any).code === 'P2002') {
        return { error: 'Failed to create game. Slug or another unique field already exists.' };
    }
    return { error: 'An unexpected error occurred during game creation.' };
  }
}