// app/(admin)/game/[id]/keys/page.tsx
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

// 🚀 Server Action สำหรับการอ่านคีย์ทั้งหมด (ต้องสร้างไฟล์นี้)
import { getKeysByGameId } from '@/action/gameKey/readKey'; 
// 🚀 Client Component สำหรับปุ่มลบ (ต้องสร้าง/นำเข้า)
import { KeyDeleteButton } from '@/components/game/KeyDeleteButton'; 

// Props ที่รับจาก Dynamic Route Segment
interface KeyManagementPageProps {
  params: { id: string };
}

// Component หลักที่เป็น Server Component
export default async function GameKeyManagementPage({ params }: KeyManagementPageProps) {
  
  const gameId = parseInt(params.id);
  if (isNaN(gameId)) notFound();

  // 1. READ: ดึงข้อมูลเกมหลักและคีย์ทั้งหมด
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  const keys = await getKeysByGameId(gameId); // เรียก Server Action เพื่อดึงคีย์

  if (!game) notFound();

  const availableKeysCount = keys.filter(k => k.status === 'Available').length;

  return (
    <div className="flex flex-col gap-5 p-5">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Keys for: {game.title}
        </h1>

      </div>

      {/* สรุปข้อมูล */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-meta-5/10 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Keys</p>
            <p className="text-2xl font-bold">{keys.length}</p>
        </div>
        <div className="p-4 bg-success/10 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Available Stock</p>
            <p className="text-2xl font-bold text-success">{availableKeysCount}</p>
        </div>
        <div className="p-4 bg-danger/10 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Sold/Used Keys</p>
            <p className="text-2xl font-bold text-danger">{keys.length - availableKeysCount}</p>
        </div>
      </div>

      {/* ตารางแสดงคีย์ */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-2 dark:bg-meta-4">
                <th className="min-w-[300px] py-4 px-4 font-medium xl:pl-11">Game Key</th>
                <th className="min-w-[120px] py-4 px-4 font-medium">Status</th>
                <th className="min-w-[150px] py-4 px-4 font-medium">Added Date</th>
                <th className="py-4 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} className="border-b border-stroke dark:border-strokedark">
                  <td className="py-5 px-4 xl:pl-11 font-medium font-mono text-sm break-all">
                    {key.key}
                  </td>
                  <td className="py-5 px-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      key.status === 'Available' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    {/* ปุ่มลบ (ใช้ Client Component) */}
                    <KeyDeleteButton keyData={key} gameId={game.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {keys.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              No keys found for this game.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}