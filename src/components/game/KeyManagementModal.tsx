'use client';

import React, { useState, useEffect } from 'react';
import { addGameKeys } from '@/action/gameKey/addKeys';
import { deleteGameKey } from '@/action/gameKey/deleteKey';
import { getKeysByGameId } from '@/action/gameKey/readKey';
import { useFormStatus } from 'react-dom';
import { format } from 'date-fns';

interface KeyManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameId: number;
    gameTitle: string;
}

// ✅ 1. สร้าง Component สำหรับปุ่ม Submit แยกออกมาโดยเฉพาะ
// เพื่อให้ useFormStatus ทำงานได้อย่างถูกต้อง
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:bg-gray-500 disabled:cursor-wait transition-colors"
        >
            {pending ? 'Processing...' : 'Import Keys'}
        </button>
    );
}

// ✅ 2. แก้ไข AddKeyForm ให้รับ onKeyAdded prop เพื่อสั่งให้ parent re-fetch
interface AddKeyFormProps {
    gameId: number;
    onKeyAdded: () => void; // Callback function
}

function AddKeyForm({ gameId, onKeyAdded }: AddKeyFormProps) {
    const [status, setStatus] = useState<any>({});

    const handleAddKeys = async (formData: FormData) => {
        const result = await addGameKeys(gameId, formData);
        setStatus(result);
        if (result.success) {
            (document.getElementById('add-keys-form') as HTMLFormElement)?.reset();
            onKeyAdded(); // ✅ 3. เรียก callback function เมื่อเพิ่มคีย์สำเร็จ
        }
    };

    return (
        // `action` จะทำงานร่วมกับ <SubmitButton /> ที่อยู่ข้างใน
        <form id="add-keys-form" action={handleAddKeys} className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-boxdark-2">
            <h4 className="font-semibold text-lg text-black dark:text-white">Add New Keys (BULK)</h4>
            
            {status.error && <p className="text-red-500 text-sm">{status.error}</p>}
            {status.success && <p className="text-green-500 text-sm">{status.message}</p>}

            <div>
                <label htmlFor="keysList" className="mb-2 block text-sm text-black dark:text-white">Paste Keys (One per line)</label>
                <textarea
                    id="keysList"
                    name="keysList"
                    rows={5}
                    required
                    className="w-full rounded border p-2 bg-white dark:bg-form-input dark:text-white"
                    placeholder="KEY1-XXXX-XXXX-XXXX&#10;KEY2-YYYY-YYYY-YYYY"
                />
            </div>
            {/* ✅ 4. ใช้ Component SubmitButton ที่สร้างไว้ */}
            <SubmitButton /> 
        </form>
    );
}

// Component หลักสำหรับ Key Management
export default function KeyManagementModal({ isOpen, onClose, gameId, gameTitle }: KeyManagementModalProps) {
    const [keys, setKeys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchKeys = async () => {
        if (!gameId) return;
        setIsLoading(true);
        const fetchedKeys = await getKeysByGameId(gameId);
        setKeys(fetchedKeys);
        setIsLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchKeys();
        }
    }, [isOpen, gameId]);

    const handleDelete = async (keyId: string) => {
        if (confirm(`Confirm deletion of key ${keyId.substring(0, 8)}...?`)) {
            const result = await deleteGameKey(keyId, gameId);
            if (result.success) {
                alert(result.message);
                fetchKeys();
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
                    <div className="lg:col-span-1">
                        {/* ✅ 5. ส่ง fetchKeys เป็น prop onKeyAdded เข้าไป */}
                        <AddKeyForm gameId={gameId} onKeyAdded={fetchKeys} />
                    </div>
                    <div className="lg:col-span-2">
                        <h4 className="font-semibold text-lg mb-3 text-black dark:text-white">Inventory List ({keys.length} Total)</h4>
                        {isLoading ? (
                            <p className="text-center py-8">Loading keys...</p>
                        ) : (
                            <div className="max-h-80 overflow-y-auto border rounded-md">
                                <table className="w-full text-sm text-black dark:text-white">
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
                                            <tr key={key.id} className="border-b dark:border-strokedark">
                                                <td className="p-2 truncate max-w-xs font-mono text-xs">{key.key}</td>
                                                <td className="p-2 text-center">
                                                     <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        key.status === 'Available' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                     }`}>
                                                         {key.status}
                                                     </span>
                                                </td>
                                                <td className="p-2 text-center text-xs">
                                                    {key.createdAt ? format(new Date(key.createdAt), 'MM/dd/yy') : 'N/A'}
                                                </td>
                                                <td className="p-2 text-center">
                                                    <button
                                                        onClick={() => handleDelete(key.id)}
                                                        disabled={key.status !== 'Available'}
                                                        className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed text-xs"
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