'use client';

import React, { useState } from 'react';
import EditGameModal from './EditGameModal'; // 🆕 ต้องสร้างไฟล์นี้
import KeyManagementModal from './KeyManagementModal'; // 🆕 ต้องสร้างไฟล์นี้

// 💡 สร้าง Type สำหรับ Game Data (เพื่อให้โค้ดปลอดภัย)
interface GameType {
    id: number;
    title: string;
    slug: string;
    price: number;
    category: string;
    discount: number; // เพิ่ม field discount
    imageUrl: string; // เพิ่ม field imageUrl
    // เพิ่ม field อื่นๆ ที่คุณต้องการใช้ใน Modal
}

interface GameActionsButtonProps {
    game: GameType;
}

export function GameActionsButton({ game }: GameActionsButtonProps) {
    const [openModal, setOpenModal] = useState<'edit' | 'keys' | null>(null);

    return (
        <div className="flex gap-2">
            {/* ปุ่ม Edit */}
            <button
            onClick={() => setOpenModal('edit')}
            className="flex items-center gap-1 border border-primary text-primary bg-white hover:bg-black hover:text-yellow-100 rounded-lg px-4 py-2 text-sm font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M4 20h4.586a1 1 0 0 0 .707-.293l9.414-9.414a2 2 0 0 0 0-2.828l-2.172-2.172a2 2 0 0 0-2.828 0L4.293 14.707A1 1 0 0 0 4 15.414V20z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit
            </button>

            {/* ปุ่ม Keys */}
            <button
            onClick={() => setOpenModal('keys')}
            className="flex items-center gap-1 bg-gradient-to-r from-meta-6 to-meta-7 bg-blue-300 hover:bg-blue-950 hover:text-white text-black hover:from-meta-6/80 hover:to-meta-7/80 rounded-lg px-4 py-2 text-sm font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-meta-6"
            >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm7-5h-2a7 7 0 1 0-7 7v-2a5 5 0 1 1 5-5h2a7 7 0 0 0 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Keys
            </button>

            {/* Modal สำหรับ Edit */}
            <EditGameModal
            isOpen={openModal === 'edit'}
            onClose={() => setOpenModal(null)}
            gameData={game}
            />

            {/* Modal สำหรับ Key Management */}
            <KeyManagementModal
            isOpen={openModal === 'keys'}
            onClose={() => setOpenModal(null)}
            gameId={game.id}
            gameTitle={game.title}
            />
        </div>
    );
}