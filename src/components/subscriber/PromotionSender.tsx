"use client";

import { useState, FormEvent, ChangeEvent } from 'react';

export function PromotionSender() {
    const [isOpen, setIsOpen] = useState(false);
    const [subject, setSubject] = useState("");
    const [headline, setHeadline] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [targetGenre, setTargetGenre] = useState("All");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const gameCategories = ["All", "Action", "RPG", "Strategy", "Simulation", "Sports"];

    const handleSendPromotion = async (e: FormEvent) => {
        e.preventDefault();
        if (!image) {
            setStatus("Please upload a promotion image.");
            return;
        }
        setLoading(true);
        setStatus("Sending...");

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("headline", headline);
        formData.append("image", image);
        formData.append("targetGenre", targetGenre);

        try {
            const res = await fetch('/api/send-promotion', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setStatus(`✅ Successfully sent to ${data.sentCount} subscribers!`);
                setSubject("");
                setHeadline("");
                setImage(null);
                setIsOpen(false);
            } else {
                throw new Error(data.error || "Failed to send promotion.");
            }
        } catch (error: any) {
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
                🚀 Send Promotion
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
                    <div className="bg-boxdark p-6 rounded-lg shadow-xl w-full max-w-lg z-50 text-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Create Promotion Email</h2>
                            <button onClick={() => setIsOpen(false)} className="text-2xl">&times;</button>
                        </div>
                        
                        <form onSubmit={handleSendPromotion} className="space-y-4">
                            <div>
                                <label htmlFor="subject" className="block mb-1">Email Subject</label>
                                <input id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full p-2 rounded bg-form-input text-white"/>
                            </div>
                            <div>
                                <label htmlFor="headline" className="block mb-1">Promotion Headline</label>
                                <input id="headline" type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} required placeholder="e.g., Autumn Sale is Here!" className="w-full p-2 rounded bg-form-input text-white"/>
                            </div>
                            <div>
                                <label htmlFor="targetGenre" className="block mb-1">Target Audience (Genre)</label>
                                <select id="targetGenre" value={targetGenre} onChange={(e) => setTargetGenre(e.target.value)} className="w-full p-2 rounded bg-form-input text-white">
                                    {gameCategories.map(g => <option key={g} value={g} className="text-black">{g}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="image" className="block mb-1">Promotion Image</label>
                                <input id="image" type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => { if(e.target.files) setImage(e.target.files[0]); }} required className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                            </div>
                            <div className="text-right">
                                <button type="submit" disabled={loading} className="px-5 py-2 bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-500">
                                    {loading ? 'Sending...' : 'Send Now'}
                                </button>
                            </div>
                            {status && <p className="mt-4 text-center text-sm">{status}</p>}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}