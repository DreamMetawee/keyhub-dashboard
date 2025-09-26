// components/charts/UserAndOrderStatistics.tsx
import prisma from '@/lib/prisma';
import React from 'react';
import { endOfMonth, startOfMonth, subDays, format } from 'date-fns';

// สมมติว่า Component กราฟชื่อ 'LineChart'
// import LineChart from '@/components/ui/LineChart'; 

async function UserAndOrderStatistics() {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  // ดึงข้อมูลผู้ใช้ใหม่และคำสั่งซื้อที่เสร็จสมบูรณ์ในช่วง 30 วัน
  const newUsers = await prisma.user.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
  });

  const completedOrders = await prisma.order.findMany({
    where: { orderDate: { gte: thirtyDaysAgo }, status: 'Completed' },
    select: { orderDate: true },
  });

  // ******* LOGIC สำหรับจัดกลุ่มข้อมูลรายวัน *******
  const dailyData: { [key: string]: { users: number, orders: number } } = {};
  
  // เตรียมโครงสร้างข้อมูล 30 วัน
  for (let d = thirtyDaysAgo; d <= today; d = subDays(d, -1)) {
    const dateKey = format(d, 'yyyy-MM-dd');
    dailyData[dateKey] = { users: 0, orders: 0 };
  }
  
  // นับผู้ใช้
  newUsers.forEach(user => {
    const dateKey = format(user.createdAt, 'yyyy-MM-dd');
    if (dailyData[dateKey]) dailyData[dateKey].users += 1;
  });

  // นับคำสั่งซื้อ
  completedOrders.forEach(order => {
    const dateKey = format(order.orderDate, 'yyyy-MM-dd');
    if (dailyData[dateKey]) dailyData[dateKey].orders += 1;
  });

  const chartData = Object.keys(dailyData).map(date => ({
    date: date,
    NewUsers: dailyData[date].users,
    NewOrders: dailyData[date].orders,
  }));
  // ******* สิ้นสุด LOGIC จัดกลุ่ม *******

  return (
    <div className="rounded-sm border border-stroke bg-white p-5 shadow-default">
      <h3 className="text-xl font-semibold text-black mb-4">User & Order Trends (Last 30 Days)</h3>
      
      {/* ส่งข้อมูลที่เตรียมไว้ (chartData) ไปให้ Component กราฟของ Template */}
      {/* <LineChart data={chartData} xAxisKey="date" lines={['NewUsers', 'NewOrders']} /> */}
      
      <pre className="text-xs overflow-auto">{JSON.stringify(chartData.slice(-5), null, 2)}</pre>
    </div>
  );
}

export default UserAndOrderStatistics;