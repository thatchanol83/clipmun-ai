'use client';

import { useState } from 'react';
import { X, Calendar, Clock, Facebook, Youtube } from 'lucide-react';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoTitle?: string;
    initialVideoUrl?: string | null;
    initialCaption?: string;
    initialHashtags?: string[];
}

export default function ScheduleModal({
    isOpen,
    onClose,
    videoTitle = 'My Amazing Video',
    initialVideoUrl,
    initialCaption,
    initialHashtags
}: ScheduleModalProps) {
    if (!isOpen) return null;

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['youtube']);

    // Note: In a real app, we would store the passed video/caption/hashtags 
    // in the DB when confirming the schedule. For now, we assume they are handled by the parent
    // or we would add hidden fields/state here if this form submitted directly.

    const togglePlatform = (p: string) => {
        if (selectedPlatforms.includes(p)) {
            setSelectedPlatforms(selectedPlatforms.filter(i => i !== p));
        } else {
            setSelectedPlatforms([...selectedPlatforms, p]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-1">Schedule Post</h2>
                <p className="text-slate-400 text-sm mb-6">Choose when to publish "{videoTitle}"</p>

                <div className="space-y-6">
                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1">
                                <Calendar size={12} /> Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1">
                                <Clock size={12} /> Time
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>

                    {/* Platforms */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-500">Post to</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => togglePlatform('youtube')}
                                className={`flex-1 py-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${selectedPlatforms.includes('youtube')
                                    ? 'bg-red-500/10 border-red-500 text-red-500'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 grayscale opacity-50 hover:grayscale-0 hover:opacity-100'
                                    }`}
                            >
                                <Youtube size={24} />
                                <span className="text-xs font-medium">YouTube</span>
                            </button>

                            <button
                                onClick={() => togglePlatform('facebook')}
                                className={`flex-1 py-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${selectedPlatforms.includes('facebook')
                                    ? 'bg-blue-500/10 border-blue-500 text-blue-500'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 grayscale opacity-50 hover:grayscale-0 hover:opacity-100'
                                    }`}
                            >
                                <Facebook size={24} />
                                <span className="text-xs font-medium">Facebook</span>
                            </button>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                        Confirm Schedule
                    </button>
                </div>
            </div>
        </div>
    );
}
