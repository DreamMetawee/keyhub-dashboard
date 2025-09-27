// components/game/DeleteButton.tsx
'use client';

import React from 'react';
import { deleteGame } from '@/action/game/delete'; // 🚀 Server Action

interface DeleteButtonProps {
    gameId: number;
    gameTitle: string;
}

export function DeleteButton({ gameId, gameTitle }: DeleteButtonProps) {
    
    // Server Action ที่ถูกผูกค่า (bind)
    const deleteGameWithId = deleteGame; // Action ที่รับ FormData

    // Client Handler ที่ทำหน้าที่ยืนยันและ Submit Form
    const handleSubmit = async (formData: FormData) => {
        if (confirm(`Are you sure you want to delete the game "${gameTitle}"?`)) {
            // เรียก Server Action
            await deleteGameWithId(formData); 
        }
    };

    return (
        <form 
            action={handleSubmit} // 👈 ใช้ Client Handler เพื่อจัดการ confirm()
            style={{ display: 'inline-block' }}
        >
            {/* Hidden Input สำหรับส่ง ID ไปให้ Action */}
            <input type="hidden" name="gameId" value={gameId} />
            <button
                type="submit"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-4 py-2 shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Delete
            </button>
        </form>
    );
}