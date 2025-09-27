'use client';

import React from 'react';
import { deleteUser } from '@/action/users/deleteUser'; // 🚀 Server Action ลบผู้ใช้

interface UserDeleteButtonProps {
    userId: string;
    userEmail: string;
}

export function UserDeleteButton({ userId, userEmail }: UserDeleteButtonProps) {
    
    // Client Handler ที่ทำหน้าที่ยืนยันและ Submit Form
    const handleSubmit = async (formData: FormData) => {
        // ใช้ confirm() เพื่อให้ผู้ใช้ยืนยันก่อนลบ
        if (confirm(`Are you absolutely sure you want to delete the user account for ${userEmail}? This action cannot be undone.`)) {
            
            // ดึง userId จาก FormData และส่งเป็น string
            const userIdValue = formData.get('userId');
            if (typeof userIdValue === 'string') {
                const result = await deleteUser(userIdValue);
                if (result.error) {
                    alert(`Error deleting user: ${result.error}`);
                }
                // ถ้าสำเร็จ Server Action จะจัดการ revalidatePath ให้เอง
            } else {
                alert('Invalid user ID.');
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
            <input type="hidden" name="userId" value={userId} />
            <button 
                type="submit" 
                className="text-white bg-danger hover:bg-danger/90 rounded-md px-3 py-1 text-sm transition-all"
            >
                Delete
            </button>
        </form>
    );
}