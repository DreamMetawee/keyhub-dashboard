// app/(admin)/orders/page.tsx
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

export const metadata = {
    title: 'Orders Management | Admin',
};

// Helper Function สำหรับแสดงสถานะเป็นสี
const getStatusClasses = (status: string) => {
    switch (status) {
        case 'Completed':
            return 'bg-success/10 text-success';
        case 'Pending':
            return 'bg-warning/10 text-warning';
        case 'Failed':
            return 'bg-danger/10 text-danger';
        default:
            return 'bg-gray-200 text-gray-700';
    }
};

// Component หลักที่เป็น Server Component
export default async function OrdersManagementPage() {
    
    // 1. READ: ดึงข้อมูลคำสั่งซื้อทั้งหมด
    const orders = await prisma.order.findMany({
        orderBy: { orderDate: "desc" },
        // รวมข้อมูลผู้ใช้ (Customer) ที่ทำการสั่งซื้อ
        include: {
            user: true, 
        }
    });

    // 2. คำนวณยอดรวม (Optional)
    const totalOrders = orders.length;

    return (
        <div className="flex flex-col gap-5 p-5">
            
            <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
                Orders Management ({totalOrders} Total)
            </h1>

            {/* ตารางแสดงรายการคำสั่งซื้อ */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
                                <th className="min-w-[150px] py-4 px-4 font-medium xl:pl-11">Order ID</th>
                                <th className="min-w-[200px] py-4 px-4 font-medium">Customer / Email</th>
                                <th className="min-w-[120px] py-4 px-4 font-medium">Total</th>
                                <th className="min-w-[120px] py-4 px-4 font-medium">Status</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium">Order Date</th>
                                <th className="py-4 px-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-stroke dark:border-strokedark">
                                    <td className="py-5 px-4 xl:pl-11 font-mono text-sm">
                                        {order.id.substring(0, 8).toUpperCase()}...
                                    </td>
                                    <td className="py-5 px-4">
                                        <h5 className="font-medium text-black dark:text-white">{order.user?.name || 'Guest'}</h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.user?.email || 'N/A'}</p>
                                    </td>
                                    <td className="py-5 px-4 font-medium text-lg">
                                        {/* 💡 แสดงผล Total Amount เป็นตัวเลข (สมมติว่าเป็น Decimal หรือ Number) */}
                                        ${order.totalAmount.toFixed(2)} 
                                    </td>
                                    <td className="py-5 px-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusClasses(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4 text-sm">
                                        {format(order.orderDate, 'MMM dd, yyyy HH:mm')}
                                    </td>
                                    
                                    <td className="py-5 px-4 space-x-2">
                                        {/* Placeholder for future detailed page */}
                                        <button 
                                            // 💡 ในการใช้งานจริง ควร Link ไปที่ /admin/orders/[id]
                                            className="text-primary hover:text-blue-700 text-sm font-medium"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {totalOrders === 0 && (
                        <div className="py-10 text-center text-gray-500">
                            No orders found in the database.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}