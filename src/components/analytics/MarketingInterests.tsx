// components/analytics/MarketingInterests.tsx
import prisma from '@/lib/prisma';
import React from 'react';

async function MarketingInterests() {
  const topInterests = await prisma.productInterest.groupBy({
    by: ['gameId'],
    _count: { gameId: true },
    orderBy: { _count: { gameId: 'desc' } },
    take: 5,
  });

  // ดึงชื่อเกม
  const gameIds = topInterests.map(i => i.gameId);
  const games = await prisma.game.findMany({
    where: { id: { in: gameIds } },
    select: { id: true, title: true }
  });

  const interestData = topInterests.map(interest => {
    const game = games.find(g => g.id === interest.gameId);
    return {
      title: game?.title || `Game ID: ${interest.gameId}`,
      count: interest._count.gameId,
    };
  });
  
  const totalSubscribers = await prisma.emailSubscriber.count();

  return (
    <div className="rounded-sm border border-stroke bg-white p-5 shadow-default">
      <h3 className="text-xl font-semibold text-black mb-4">Marketing & CDP Insights</h3>
      
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Top 5 Most Viewed Games:</h4>
        <ul className="list-disc ml-5">
          {interestData.map((item, index) => (
            <li key={index}>{item.title} ({item.count} views/actions)</li>
          ))}
        </ul>

        <h4 className="text-lg font-medium pt-3">Automation Marketing Summary:</h4>
        <p>Total Email Subscribers: **{totalSubscribers}**</p>
        <p className="text-sm text-gray-600">
          *ใช้ข้อมูลนี้ (ร่วมกับ ProductInterest) เพื่อส่งอีเมลแนะนำสินค้า (Personalized Marketing) และส่งอีเมลแจ้งข่าวสาร (Automation Marketing)
        </p>
      </div>
    </div>
  );
}

export default MarketingInterests;