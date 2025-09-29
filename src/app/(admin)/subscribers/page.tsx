import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { SubscriberDeleteButton } from '@/components/subscriber/SubscriberDeleteButton';
// เดี๋ยวเราจะสร้าง Component นี้ในขั้นตอนถัดไป
import { PromotionSender } from "@/components/subscriber/PromotionSender";

export const metadata = {
    title: 'Email Subscribers | Admin',
};

export default async function SubscriberManagementPage() {
    
    const subscribers = await prisma.emailSubscriber.findMany({
        orderBy: { subscribedAt: 'desc' },
        select: {
            id: true,
            email: true,
            subscribedAt: true,
            source: true,
            favoriteGenre: true, // ✅ ดึงข้อมูล genre มาด้วย
        },
    });

    const totalSubscribers = subscribers.length;

    return (
        <div className="flex flex-col gap-5 p-5">
            
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black dark:text-white">
                    Email Subscribers ({totalSubscribers} Total)
                </h1>
                {/* ✅ เพิ่มปุ่มสำหรับส่งโปรโมชันตรงนี้ */}
                <PromotionSender />
            </div>

            <div className="rounded-sm border ...">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
                                <th className="py-4 px-4 font-medium ...">Email Address</th>
                                {/* ✅ เพิ่ม Header ของคอลัมน์ใหม่ */}
                                <th className="py-4 px-4 font-medium ...">Favorite Genre</th>
                                <th className="py-4 px-4 font-medium ...">Subscribed Date</th>
                                <th className="py-4 px-4 font-medium ...">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((subscriber) => (
                                <tr key={subscriber.id} className="border-b ...">
                                    <td className="py-5 px-4 ...">
                                        {subscriber.email}
                                    </td>
                                    {/* ✅ เพิ่ม Cell สำหรับแสดงข้อมูล Genre */}
                                    <td className="py-5 px-4 ...">
                                        <span className="bg-blue-100 text-blue-800 text-xs  font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                            {subscriber.favoriteGenre || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4 text-sm">
                                        {format(subscriber.subscribedAt, 'MMM dd, yyyy HH:mm')}
                                    </td>
                                    <td className="py-5 px-4 space-x-2">
                                        <SubscriberDeleteButton 
                                            subscriberId={subscriber.id} 
                                            subscriberEmail={subscriber.email} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}