'use client';

import React from 'react';
import { deleteSubscriber } from '@/action/marketing/deleteSubscriber';

interface SubscriberDeleteButtonProps {
    subscriberId: string;
    subscriberEmail: string;
}

export function SubscriberDeleteButton({ subscriberId, subscriberEmail }: SubscriberDeleteButtonProps) {
    
    const handleSubmit = async (formData: FormData) => {
        // ใช้ confirm() เพื่อให้ผู้ใช้ยืนยันก่อนลบ
        if (confirm(`Are you sure you want to remove the email "${subscriberEmail}" from the mailing list?`)) {
            
            const result = await deleteSubscriber(formData); 
            
            if (result.error) {
                alert(`Action Failed: ${result.error}`);
            }
        } else {
            return; // ยกเลิกการ Submit
        }
    };

    return (
        <form 
            // 💡 เชื่อมกับ Client Handler
            action={handleSubmit} 
            style={{ display: 'inline-block' }}
        >
            {/* Hidden Input สำหรับส่ง ID ไปให้ Server Action */}
            <input type="hidden" name="subscriberId" value={subscriberId} />
            <button 
                type="submit" 
                className="text-white bg-danger hover:bg-danger/90 rounded-md px-3 py-1 text-sm transition-all"
            >
                Unsubscribe
            </button>
        </form>
    );
}