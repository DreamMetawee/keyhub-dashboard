// app/(admin)/game/page.tsx
// **ไม่ต้องมี 'use client';**
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { deleteGame } from '@/action/game/delete';
import { formatCurrency } from '@/lib/utils';
import { DeleteButton } from '@/components/game/DeleteGameButton';

// 🚀 นำเข้าปุ่ม Client Component
import { OpenModalButton } from '@/components/game/OpenModalButton';
import { GameActionsButton } from '@/components/game/GameActionsButton';
// ลบ import React, { useState } และ GameFormModal ทิ้ง

export const metadata = {
  title: 'Game Management | Admin',
};

// Component หลักยังคงเป็น Server Component
async function GameManagementPage() {

  // 1. READ: ดึงข้อมูลเกมทั้งหมด (ยังอยู่ที่ Server)
  const games = await prisma.game.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          gameKeys: {
            where: { status: 'Available' }
          }
        }
      }
    }
  });

  return (
    <div className="flex flex-col gap-5 p-5">

      {/* ส่วน Header และปุ่ม Create */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Game Catalog Management ({games.length} Games)
        </h1>

        {/* 🚀 แทนที่ Link/Button ด้วย Client Component */}
        <OpenModalButton />
      </div>

      {/* ตารางแสดงรายการเกม */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 dark:bg-meta-4 text-left">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Title & Slug</th>
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">Price</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Category</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Available Keys</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="border-b border-stroke dark:border-strokedark">
                  <td className="py-5 px-4 xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{game.title}</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">/{game.slug}</p>
                  </td>
                  <td className="py-5 px-4 font-medium">
                    {formatCurrency(game.price)}
                  </td>
                  <td className="py-5 px-4">
                    <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">{game.category}</p>
                  </td>
                  <td className="py-5 px-4">
                    {/* 🚀 ส่วนที่แก้ไข: แสดงจำนวนคีย์ที่นับได้ */}
                    <span className="font-medium text-meta-5">
                      {game._count.gameKeys}
                    </span>
                  </td>

                  {/* 4. ACTIONS: Edit, View Keys, Delete */}
                  <td className="py-5 px-4 space-x-2 flex items-center">
                    {/* 🚀 แทนที่ Link ด้วย GameActionsButton */}
                    <GameActionsButton
                      game={{
                        id: game.id,
                        title: game.title,
                        slug: game.slug,
                        price: game.price,
                        discount: game.discount,
                        imageUrl: game.imageUrl,
                        category: game.category
                      }}
                    />

                    {/* ปุ่มลบ (DELETE) - ใช้ Client Handler (ต้องเปลี่ยนฟอร์มนี้เป็น use client หรือใช้ Server Action ตรงๆ) */}
                    <DeleteButton gameId={game.id} gameTitle={game.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {games.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              No games found. Click "Add New Game" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameManagementPage;