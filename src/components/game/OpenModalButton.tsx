'use client';

import React, { useState } from 'react';
import GameFormModal from '@/components/game/GameFormModal'; // นำเข้า Modal ที่นี่

export function OpenModalButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex justify-end">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary text-black font-semibold rounded-lg px-5 py-2 shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Game
                </button>
            </div>


            {/* Modal ถูกเรียกใช้โดย Component นี้ */}
            <GameFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
}