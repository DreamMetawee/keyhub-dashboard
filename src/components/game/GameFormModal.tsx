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
  'Sports',
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
        ? 'bg-blue-400 cursor-not-allowed shadow-none text-black'
        : 'bg-blue-600 text-black hover:bg-blue-700 shadow-lg hover:scale-[1.02]'
      }
      `}
    >
      {pending ? 'Adding Game...' : 'Add Game to Catalog'}
    </button>
  );
};

export default function GameFormModal({ isOpen, onClose }: GameFormModalProps) {
  if (!isOpen) return null;

  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // แสดง preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    if (!fileName) {
      setError('Please select an image.');
      return;
    }

    // แทน imageUrl ด้วยชื่อไฟล์
    formData.set('imageUrl', `/uploads/${fileName}`);

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
          <div className="p-3 mb-4 text-sm text-danger bg-red-100 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="mb-1 block font-medium">Title</label>
              <input type="text" id="title" name="title" required className="w-full rounded border py-3 px-5" />
            </div>
            <div>
              <label htmlFor="category" className="mb-1 block font-medium">Category</label>
              <select id="category" name="category" required className="w-full rounded border py-3 px-5">
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map(cat => (
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

          {/* Upload + Preview */}
          <div>
            <label htmlFor="image" className="mb-1 block font-medium">Upload Image</label>
            <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} required className="w-full rounded border py-3 px-5" />
            {preview && (
              <img src={preview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded" />
            )}
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
