'use client';

import React, { useState, useEffect } from 'react';
import { addGameKeys } from '@/action/gameKey/addKeys'; // 🚀 Action เพิ่มคีย์
import { deleteGameKey } from '@/action/gameKey/deleteKey'; // 🚀 Action ลบคีย์
import { getKeysByGameId } from '@/action/gameKey/readKey'; // 🚀 Action อ่านคีย์
import { useFormStatus } from 'react-dom';
import { format } from 'date-fns';

interface KeyManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameId: number;
    gameTitle: string;
}

// Component ย่อยสำหรับการเพิ่มคีย์
function AddKeyForm({ gameId }: { gameId: number }) {
    const [status, setStatus] = useState<any>({});
    const { pending } = useFormStatus();

    // 💡 Client Handler: ห่อหุ้ม Server Action เพื่อจัดการสถานะ
    const handleAddKeys = async (formData: FormData) => {
        const result = await addGameKeys(gameId, formData);
        setStatus(result);
        if (result.success) {
            // ล้าง Form หลังจากสำเร็จ (ถ้าต้องการ)
            (document.getElementById('add-keys-form') as HTMLFormElement)?.reset();
        }
    };

    return (
        <form id="add-keys-form" action={handleAddKeys} className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold text-lg">Add New Keys (BULK)</h4>

            {status.error && <p className="text-danger text-sm">{status.error}</p>}
            {status.success && <p className="text-success text-sm">{status.message}</p>}

            <div>
                <label htmlFor="keysList" className="mb-2 block text-sm">Paste Keys (One per line)</label>
                <textarea
                    id="keysList"
                    name="keysList"
                    rows={5}
                    required
                    className="w-full rounded border p-2"
                />
            </div>
            <button
                type="submit"
                disabled={pending}
                className="w-full bg-meta-5 bg-black hover:bg-blue-500 text-white py-2 rounded-md hover:bg-meta-5/90"
            >
                {pending ? 'Processing...' : 'Import Keys'}
            </button>
        </form>
    );
}

// Component หลักสำหรับ Key Management
export default function KeyManagementModal({ isOpen, onClose, gameId, gameTitle }: KeyManagementModalProps) {
    const [keys, setKeys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 🚀 Function ดึงข้อมูลคีย์ (Client-side Fetching)
    const fetchKeys = async () => {
        setIsLoading(true);
        // เนื่องจาก getKeysByGameId เป็น Server Action, เราสามารถเรียกมันได้โดยตรง
        const fetchedKeys = await getKeysByGameId(gameId);
        setKeys(fetchedKeys);
        setIsLoading(false);
    };

    // ดึงข้อมูลเมื่อ Modal เปิด
    useEffect(() => {
        if (isOpen && gameId) {
            fetchKeys();
        }
    }, [isOpen, gameId]);

    // Handler สำหรับลบ (ต้อง re-fetch data)
    const handleDelete = async (keyId: string) => {
        if (confirm(`Confirm deletion of key ${keyId.substring(0, 8)}...? This key is available.`)) {
            const result = await deleteGameKey(keyId, gameId);
            if (result.success) {
                alert(result.message);
                fetchKeys(); // ดึงข้อมูลใหม่เพื่ออัปเดตตาราง
            } else {
                alert(result.error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-lg shadow-2xl p-6 dark:bg-boxdark relative w-full max-h-[90vh] overflow-y-auto mx-4 sm:max-w-xl md:max-w-3xl lg:max-w-4xl">

                <div className="sticky top-0 bg-white dark:bg-boxdark z-10 flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-black dark:text-white">Manage Keys for: {gameTitle}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-2xl">&times;</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* คอลัมน์ซ้าย: Add Form */}
                    <div className="lg:col-span-1">
                        <AddKeyForm gameId={gameId} />
                    </div>

                    {/* คอลัมน์ขวา: Key List */}
                    <div className="lg:col-span-2">
                        <h4 className="font-semibold text-lg mb-3">Inventory List ({keys.length} Total)</h4>

                        {isLoading ? (
                            <p className="text-center py-8">Loading keys...</p>
                        ) : (
                            <div className="max-h-80 overflow-y-auto border rounded-md">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-100 dark:bg-meta-4">
                                        <tr>
                                            <th className="p-2 text-left">Key</th>
                                            <th className="p-2">Status</th>
                                            <th className="p-2">Added Date</th>
                                            <th className="p-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {keys.map((key) => (
                                            <tr key={key.id} className="border-b">
                                                <td className="p-2 truncate max-w-xs font-mono text-xs">{key.key}</td>
                                                <td className="p-2 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs ${key.status === 'Available' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'
                                                        }`}>
                                                        {key.status}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-center text-xs">
                                                    {key.createdAt
                                                        ? format(key.createdAt, 'MM/dd/yy')
                                                        : 'N/A'}
                                                </td>
                                                <td className="p-2 text-center">
                                                    <button
                                                        onClick={() => handleDelete(key.id)}
                                                        disabled={key.status !== 'Available'}
                                                        className="text-danger hover:text-red-700 disabled:text-gray-400 text-xs"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}