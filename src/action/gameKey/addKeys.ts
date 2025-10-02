'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type AddKeysInput = FormData | { keysList: string };

export async function addGameKeys(gameId: number, input: AddKeysInput) {
  let keysList: string | null = null;

  // ตรวจสอบ input
  if (input instanceof FormData) {
    const val = input.get('keysList');
    if (typeof val === 'string') keysList = val;
  } else if (typeof input === 'object' && 'keysList' in input) {
    keysList = input.keysList;
  }

  if (!keysList || keysList.trim() === '') {
    return { error: 'Please enter at least one game key.' };
  }

  // แยกแต่ละบรรทัดและลบ empty line
  const keysArray = keysList
    .split(/\r?\n/) // รองรับ Windows \r\n และ Unix \n
    .map(k => k.trim())
    .filter(k => k.length > 0);

  if (keysArray.length === 0) {
    return { error: 'No valid keys found after cleaning the input.' };
  }

  const dataToCreate = keysArray.map(key => ({
    key,
    gameId,
    status: 'Available',
  }));

  try {
    const result = await prisma.gameKey.createMany({
      data: dataToCreate,
      skipDuplicates: true,
    });

    revalidatePath(`/dashboard/games/${gameId}/keys`);

    return {
      success: true,
      message: `${result.count} new key(s) added successfully.`,
      count: result.count,
    };
  } catch (e) {
    console.error('Add Game Keys Error:', e);
    return { error: 'Failed to add game keys. Check if Game ID is valid.' };
  }
}
