'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Youtube, Facebook, Calendar as CalendarIcon } from 'lucide-react';
import { getScheduledPosts, ScheduledPost } from '@/services/scheduler';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [posts, setPosts] = useState<ScheduledPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        const data = await getScheduledPosts();
        setPosts(data);
        setLoading(false);
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getPostsForDay = (day: number) => {
        return posts.filter(post => {
            const postDate = new Date(post.date);
            return (
                postDate.getDate() === day &&
                postDate.getMonth() === currentDate.getMonth() &&
                postDate.getFullYear() === currentDate.getFullYear()
            );
        });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-slate-800 bg-slate-900/50">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <CalendarIcon className="text-red-500" />
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ChevronRight />
                    </button>
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950">
                {DAYS.map(day => (
                    <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7 auto-rows-[140px] bg-slate-950">
                {/* Empty Cells */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="border-r border-b border-slate-800/50 p-2 bg-slate-950/30"></div>
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayPosts = getPostsForDay(day);
                    const isToday =
                        day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear();

                    return (
                        <div key={day} className={`border-r border-b border-slate-800/50 p-2 transition-colors hover:bg-slate-900/20 group relative ${isToday ? 'bg-indigo-500/5' : ''}`}>
                            <div className={`text-sm font-medium mb-2 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-red-500 text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                {day}
                            </div>

                            <div className="space-y-1 overflow-y-auto max-h-[90px] scrollbar-thin scrollbar-thumb-slate-700">
                                {dayPosts.map(post => (
                                    <div key={post.id} className="text-xs p-1.5 rounded bg-slate-800 border border-slate-700 hover:border-slate-600 cursor-pointer truncate transition-colors">
                                        <div className="flex items-center gap-1 mb-0.5">
                                            {post.platforms.includes('youtube') && <Youtube size={10} className="text-red-500" />}
                                            {post.platforms.includes('facebook') && <Facebook size={10} className="text-blue-500" />}
                                            <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'posted' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                        </div>
                                        <span className="text-slate-300">{post.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
