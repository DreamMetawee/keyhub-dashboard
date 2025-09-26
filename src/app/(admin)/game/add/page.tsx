// app/(admin)/game/add/page.tsx
import React from 'react';
import { createGame } from '@/action/game/create'; // 🚀 Import Server Action สำหรับการสร้าง

export const metadata = {
  title: 'Add New Game | Admin',
};

function AddGamePage() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
        Add New Game
      </h1>
      
      {/* 1. Form เชื่อมกับ Server Action */}
      <form 
        action={async (formData: FormData) => {
          await createGame(formData);
        }} 
        className="space-y-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="mb-1 block text-black dark:text-white font-medium">
                Game Title
              </label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required 
                placeholder="e.g., The Witcher 4"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" 
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="mb-1 block text-black dark:text-white font-medium">
                Category
              </label>
              <input 
                type="text" 
                id="category" 
                name="category" 
                required 
                placeholder="e.g., RPG, Action, Strategy"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary" 
              />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slug */}
            <div>
              <label htmlFor="slug" className="mb-1 block text-black dark:text-white font-medium">
                Slug (URL Path)
              </label>
              <input 
                type="text" 
                id="slug" 
                name="slug" 
                required 
                placeholder="e.g., the-witcher-4"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary" 
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="mb-1 block text-black dark:text-white font-medium">
                Price (THB)
              </label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                step="0.01" 
                required 
                placeholder="e.g., 999.50"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary" 
              />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount */}
            <div>
              <label htmlFor="discount" className="mb-1 block text-black dark:text-white font-medium">
                Discount (%)
              </label>
              <input 
                type="number" 
                id="discount" 
                name="discount" 
                step="0.01" 
                defaultValue={0}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary" 
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="mb-1 block text-black dark:text-white font-medium">
                Cover Image URL
              </label>
              <input 
                type="url" 
                id="imageUrl" 
                name="imageUrl" 
                required 
                placeholder="e.g., https://example.com/cover.jpg"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary" 
              />
            </div>
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-primary text-white py-3 rounded-md hover:bg-opacity-90 transition-all font-medium"
        >
          Add Game to Catalog
        </button>
      </form>
    </div>
  );
}

export default AddGamePage;