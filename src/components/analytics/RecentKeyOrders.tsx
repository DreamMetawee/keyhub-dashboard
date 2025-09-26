// components/tables/RecentKeyOrders.tsx
import prisma from '@/lib/prisma';
import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils'; // ฟังก์ชันที่สร้างไว้ก่อนหน้า

async function RecentKeyOrders() {
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { orderDate: 'desc' },
    include: {
      user: { select: { email: true } },
    },
  });

  return (
    <div className="rounded-sm border border-stroke bg-white p-5 shadow-default">
      <h3 className="text-xl font-semibold text-black mb-4">Recent Key Orders</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Customer Email</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-sm truncate max-w-xs">{order.id.substring(0, 8)}...</td>
                <td className="py-2 px-4 border-b">{order.user.email}</td>
                <td className="py-2 px-4 border-b font-medium">{formatCurrency(order.totalAmount)}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b text-sm">{format(order.orderDate, 'MMM d, yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentKeyOrders;