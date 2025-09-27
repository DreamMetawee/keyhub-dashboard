'use client';

import React, { useState } from 'react';
import { createGame } from '@/action/game/create';
import { useFormStatus } from 'react-dom';

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

interface GameFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-3 transition-all duration-200
            ${pending
            ? 'bg-blue-400 cursor-not-allowed shadow-none text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:scale-[1.02]'
            }
            `}
        >
            {pending ? (
            <>
            <span className="relative flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-gray-500"></span>
            </span>
            <span className="ml-2">Adding Game...</span>
            </>
            ) : (
            <>
            <svg className="h-5 w-5 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="ml-2">Add Game to Catalog</span>
            </>
            )}
        </button>
    );
};

export default function GameFormModal({ isOpen, onClose }: GameFormModalProps) {
    if (!isOpen) return null;
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setError(null); 
        const result = await createGame(formData); 
        if (result.error) {
            setError(result.error);
        } else {
            alert(result.message); 
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-lg shadow-2xl p-6 dark:bg-boxdark relative w-full max-h-[50vh] overflow-y-auto mx-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                <div className="sticky top-0 bg-white dark:bg-boxdark z-10 flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-black dark:text-white">Add New Game</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-2xl">&times;</button>
                </div>
                {error && (
                    <div className="p-3 mb-4 text-sm text-danger bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="mb-1 block font-medium">Title</label>
                            <input type="text" id="title" name="title" required className="w-full rounded border py-3 px-5" />
                        </div>
                        <div>
                            <label htmlFor="category" className="mb-1 block font-medium">Category</label>
                            <select 
                                id="category" 
                                name="category"
                                required 
                                className="w-full rounded border border-stroke bg-white py-3 px-5 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            >
                                <option value="" disabled>Select a category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="slug" className="mb-1 block font-medium">Slug</label>
                        <input type="text" id="slug" name="slug" required className="w-full rounded border py-3 px-5" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="mb-1 block font-medium">Price</label>
                            <input type="number" id="price" name="price" required min="0" step="0.01" className="w-full rounded border py-3 px-5" />
                        </div>
                        <div>
                            <label htmlFor="discount" className="mb-1 block font-medium">Discount (%)</label>
                            <input type="number" id="discount" name="discount" required min="0" max="100" step="1" className="w-full rounded border py-3 px-5" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="mb-1 block font-medium">Image URL</label>
                        <input type="url" id="imageUrl" name="imageUrl" required className="w-full rounded border py-3 px-5" />
                    </div>
                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}
