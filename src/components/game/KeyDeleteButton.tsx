'use client';

import React from 'react';
import { deleteGameKey } from '@/action/gameKey/deleteKey'; 

interface KeyDeleteButtonProps {
    keyData: { id: string; status: string; key: string };
    gameId: number;
}

export function KeyDeleteButton({ keyData, gameId }: KeyDeleteButtonProps) {
    
    // Server Action ที่ถูกผูกค่าสำหรับ Client Handler
    const handleDelete = async (formData: FormData) => {
        if (keyData.status !== 'Available') {
            alert(`Error: Cannot delete key with status "${keyData.status}".`);
            return;
        }

        if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบคีย์: ${keyData.key.substring(0, 15)}...?`)) {
            const result = await deleteGameKey(keyData.id, gameId); 
            if (result.error) {
                alert(`Delete Failed: ${result.error}`);
            } else {
                // ไม่ต้องทำอะไร เพราะ Server Action จะ Revalidate Path ให้เอง
            }
        }
    };

    return (
        <form 
            // 💡 ใช้ Action โดยตรงเพื่อประโยชน์ของ Server Action
            action={handleDelete} 
            style={{ display: 'inline-block' }}
        >
            <input type="hidden" name="keyId" value={keyData.id} />
            <button 
                type="submit" 
                disabled={keyData.status !== 'Available'} // ปิดการใช้งานปุ่มถ้าคีย์ถูกขายแล้ว
                className={`rounded-md px-3 py-1 text-xs transition-all ${
                    keyData.status === 'Available' 
                    ? 'text-white bg-danger hover:bg-danger/90' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
                Delete
            </button>
        </form>
    );
}