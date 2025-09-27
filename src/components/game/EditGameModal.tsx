'use client';

import React, { useState } from 'react';
import { updateGame } from '@/action/game/update'; // 🚀 Server Action สำหรับการแก้ไข
import { useFormStatus } from 'react-dom';

// รายการ Category ที่อนุญาต (ควรนำเข้าจากไฟล์ constants แต่เพื่อความเร็ว ใส่ไว้ที่นี่)
const CATEGORIES = [
  'Action', 
  'RPG', 
  'Strategy', 
  'Simulation', 
  'Adventure', 
  'Horror',
  'Indie', 
  'Sports'
];

interface GameType {
    id: number;
    title: string;
    slug: string;
    price: number;
    discount: number;
    imageUrl: string;
    category: string;
}

interface EditGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameData: GameType;
}

// Component ย่อยสำหรับปุ่ม Submit
const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full text-white py-3 rounded-md font-medium transition-all ${
                pending ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90'
            }`}
        >
            {pending ? 'Saving Changes...' : 'Save Changes'}
        </button>
    );
};

export default function EditGameModal({ isOpen, onClose, gameData }: EditGameModalProps) {
    if (!isOpen) return null;

    const [error, setError] = useState<string | null>(null);

    // ผูก Server Action กับ ID ของเกมปัจจุบัน
    const updateGameWithId = updateGame.bind(null, gameData.id);

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        const result = await updateGameWithId(formData);

        if (result.error) {
            setError(result.error);
        } else {
            alert(result.message);
            onClose(); 
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-lg shadow-2xl p-6 dark:bg-boxdark relative w-full max-h-[90vh] overflow-y-auto mx-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                
                <div className="sticky top-0 bg-white dark:bg-boxdark z-10 flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-black dark:text-white">Edit: {gameData.title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-2xl">&times;</button>
                </div>

                {error && (<div className="p-3 mb-4 text-sm text-danger bg-red-100 rounded-lg">{error}</div>)}

                {/* Form เชื่อมกับ Action Handler */}
                <form action={handleSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="mb-1 block font-medium">Title</label>
                            <input type="text" id="title" name="title" defaultValue={gameData.title} required className="w-full rounded border py-3 px-5" />
                        </div>
                        
                        {/* Category (Dropdown) */}
                        <div>
                            <label htmlFor="category" className="mb-1 block font-medium">Category</label>
                            <select 
                                id="category" 
                                name="category"
                                defaultValue={gameData.category} // 💡 แสดงค่าปัจจุบัน
                                required 
                                className="w-full rounded border border-stroke bg-white py-3 px-5 outline-none"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" className="mb-1 block font-medium">Slug</label>
                        <input type="text" id="slug" name="slug" defaultValue={gameData.slug} required className="w-full rounded border py-3 px-5" />
                    </div>
                    
                    {/* Price & Discount */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="mb-1 block font-medium">Price</label>
                            <input type="number" id="price" name="price" defaultValue={gameData.price} required min="0" step="0.01" className="w-full rounded border py-3 px-5" />
                        </div>
                        <div>
                            <label htmlFor="discount" className="mb-1 block font-medium">Discount (%)</label>
                            <input type="number" id="discount" name="discount" defaultValue={gameData.discount} required min="0" max="100" step="1" className="w-full rounded border py-3 px-5" />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label htmlFor="imageUrl" className="mb-1 block font-medium">Image URL</label>
                        <input type="url" id="imageUrl" name="imageUrl" defaultValue={gameData.imageUrl} required className="w-full rounded border py-3 px-5" />
                    </div>
                    
                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}