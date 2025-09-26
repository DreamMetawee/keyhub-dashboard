// components/analytics/SubscriptionSummary.tsx
import prisma from '@/lib/prisma';
import React from 'react';

// สมมติว่า Component ภายในที่ใช้แสดงผลสรุปชื่อ 'TargetCard' หรือ 'InfoCard'
// คุณจะต้องนำเข้า Component นี้จาก Template ของคุณเอง
// import InfoCard from '@/components/ui/InfoCard'; 

async function SubscriptionSummary() {
  const [
    totalPlans,
    activeSubscriptions,
    expiredSubscriptions,
  ] = await prisma.$transaction([
    prisma.subscriptionPlan.count(),
    prisma.subscription.count({ where: { status: 'Active' } }),
    prisma.subscription.count({ where: { status: 'Expired' } }),
  ]);

  return (
    <div className="rounded-sm border border-stroke bg-white p-5 shadow-default">
      <h3 className="text-xl font-semibold text-black mb-4">Subscription Summary</h3>
      
      <div className="space-y-4">
        {/* คุณจะต้องปรับใช้กับ Component ของ TailAdmin ที่รับ Props เหล่านี้ */}
        {/* <InfoCard title="Total Plans" value={totalPlans} color="blue" /> */}
        {/* <InfoCard title="Active Subs" value={activeSubscriptions} color="green" /> */}
        {/* <InfoCard title="Expired Subs" value={expiredSubscriptions} color="red" /> */}
        
        <p>Total Plans: **{totalPlans}**</p>
        <p>Active Subscriptions: **{activeSubscriptions}**</p>
        <p>Expired/Cancelled: **{expiredSubscriptions}**</p>
      </div>
    </div>
  );
}

export default SubscriptionSummary;