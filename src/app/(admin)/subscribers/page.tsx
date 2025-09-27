// app/(admin)/subscribers/page.tsx
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { SubscriberDeleteButton } from '@/components/subscriber/SubscriberDeleteButton'; // 🆕 Component ลบผู้สมัคร

export const metadata = {
    title: 'Email Subscribers | Admin',
};

// Component หลักที่เป็น Server Component
export default async function SubscriberManagementPage() {
    
    // 1. READ: ดึงข้อมูลผู้สมัครรับข่าวสารทั้งหมด
    const subscribers = await prisma.emailSubscriber.findMany({
        orderBy: { subscribedAt: 'desc' },
    });

    const totalSubscribers = subscribers.length;

    return (
        <div className="flex flex-col gap-5 p-5">
            
            <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
                Email Subscribers List ({totalSubscribers} Total)
            </h1>

            {/* ตารางแสดงรายการผู้สมัคร */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
                                <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Email Address</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Subscribed Date</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((subscriber) => (
                                <tr key={subscriber.id} className="border-b border-stroke dark:border-strokedark">
                                    <td className="py-5 px-4 xl:pl-11 font-medium text-black dark:text-white">
                                        {subscriber.email}
                                    </td>
                                    <td className="py-5 px-4 text-sm">
                                        {format(subscriber.subscribedAt, 'MMM dd, yyyy HH:mm')}
                                    </td>
                                    
                                    <td className="py-5 px-4 space-x-2">
                                        {/* 🆕 Component สำหรับลบ/ยกเลิกการสมัคร */}
                                        <SubscriberDeleteButton 
                                            subscriberId={subscriber.id} 
                                            subscriberEmail={subscriber.email} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {totalSubscribers === 0 && (
                        <div className="py-10 text-center text-gray-500">
                            No one has subscribed to the mailing list yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}