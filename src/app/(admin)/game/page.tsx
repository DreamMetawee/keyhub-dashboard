// app/(admin)/game/page.tsx
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { deleteGame } from '@/action/game/delete'; // Import Server Action สำหรับการลบ
import { formatCurrency } from '@/lib/utils'; // สมมติว่ามี utility สำหรับการจัดรูปแบบเงิน

// กำหนด Metadata สำหรับหน้านี้
export const metadata = {
  title: 'Game Management | Admin',
};

// Component หลักที่เป็น Server Component
async function GameManagementPage() {
  
  // 1. READ: ดึงข้อมูลเกมทั้งหมด
  const games = await prisma.game.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // **********************************************
  // ใน Template จริงของคุณ: คุณต้องแทนที่ Button, variant, และ Class Name 
  // ให้ตรงกับ Component ของ TailAdmin ที่คุณใช้
  // **********************************************

  return (
    <div className="flex flex-col gap-5 p-5">
      
      {/* ส่วน Header และปุ่ม Create */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Game Catalog Management ({games.length} Games)
        </h1>
        {/* 2. CREATE: ปุ่มนำทางไปยังหน้าเพิ่มเกม */}
        <Link href="/admin/game/add"> 
          {/* ปรับ Link Path ให้ตรงกับโครงสร้างของคุณ เช่น /admin/game/add */}
          <button className="bg-primary hover:bg-opacity-90 text-white rounded-md px-4 py-2 transition-all">
            + Add New Game
          </button>
        </Link>
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
                    {/* [TODO]: ต้องนับจำนวนคีย์ที่ Available (ต้องใช้ include หรือ count แยก) */}
                    <span className="font-medium text-meta-5">N/A (Keys)</span> 
                  </td>

                  {/* 4. ACTIONS: Edit, View Keys, Delete */}
                  <td className="py-5 px-4 space-x-2 flex items-center">
                    
                    {/* Link แก้ไข (UPDATE) */}
                    <Link href={`/admin/game/${game.id}/edit`}>
                      <button className="text-primary border border-primary hover:bg-primary hover:text-white rounded-md px-3 py-1 text-sm transition-all">
                        Edit
                      </button>
                    </Link>
                    
                    {/* Link จัดการคีย์ (VIEW DETAIL) */}
                    <Link href={`/admin/game/${game.id}/keys`}>
                      <button className="bg-meta-6 text-white hover:bg-meta-6/80 rounded-md px-3 py-1 text-sm transition-all">
                        Keys
                      </button>
                    </Link>
                    
                    {/* ปุ่มลบ (DELETE) - ใช้ Client Handler */}
                    <form
                        style={{ display: 'inline-block' }}
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!confirm(`Are you sure you want to delete the game "${game.title}"?`)) {
                                return;
                            }
                            const formData = new FormData(e.currentTarget);
                            await deleteGame(formData);
                            // Optionally, refresh or update UI here
                        }}
                    >
                        <input type="hidden" name="gameId" value={game.id} />
                        <button 
                            type="submit" 
                            className="text-white bg-danger hover:bg-danger/90 rounded-md px-3 py-1 text-sm transition-all"
                        >
                            Delete
                        </button>
                    </form>
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