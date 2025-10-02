// app/(admin)/users/page.tsx
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { UserDeleteButton } from '@/components/customer/UserDeleteButton'; // 🆕 Component ลบผู้ใช้

export const metadata = {
    title: 'User Management | Admin',
};

// Component หลักที่เป็น Server Component
export default async function UserManagementPage() {
    
    // 1. READ: ดึงข้อมูลผู้ใช้ทั้งหมด พร้อมจำนวน Subscription
    const users = await prisma.user.findMany({
  orderBy: { createdAt: 'desc' },
  select: {
    id: true,
    name: true,
    email: true,
    createdAt: true,
    _count: {
      select: { subscriptions: { where: { status: 'Active' } } }
    }
  }
});

    return (
        <div className="flex flex-col gap-5 p-5">
            
            <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
                Customer Management ({users.length} Total)
            </h1>

            {/* ตารางแสดงรายการลูกค้า */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
                                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Name / Email</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Active Subs</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Registered Date</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-stroke dark:border-strokedark">
                                    <td className="py-5 px-4 xl:pl-11">
                                        <h5 className="font-medium text-black dark:text-white">{user.name || 'N/A'}</h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                    </td>
                                    <td className="py-5 px-4 font-medium text-center">
                                        {user._count.subscriptions > 0 ? (
                                            <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                                                {user._count.subscriptions} Active
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-500">0</span>
                                        )}
                                    </td>
                                    <td className="py-5 px-4 text-sm">
                                        {format(user.createdAt, 'MMM dd, yyyy')}
                                    </td>
                                    
                                    <td className="py-5 px-4 space-x-2 flex text-red-800 items-center">
                                        {/* 🆕 Component สำหรับลบผู้ใช้ */}
                                        <UserDeleteButton 
                                            userId={user.id.toString()} 
                                            userEmail={user.email} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {users.length === 0 && (
                        <div className="py-10 text-center text-gray-500">
                            No users found in the database.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}