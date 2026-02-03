'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, Clock, Smartphone, Monitor, Square, Globe, Sparkles, Send, Loader2, CheckCircle, PlayCircle } from 'lucide-react';
import { GeminiResponse } from '@/services/gemini';
import { KieJobResponse } from '@/services/kie';
import ScheduleModal from '@/components/publish/ScheduleModal';

const VIDEO_STYLES = [
    { id: 'realistic', name: 'Realistic', icon: '📸', desc: 'High fidelity, cinematic look' },
    { id: 'pixar', name: '3D Animation', icon: '🎨', desc: 'Cute, vibrant character style' },
    { id: 'thaibaan', name: 'Thai Baan', icon: '🌾', desc: 'Local vibe, nature, authentic' },
    { id: 'anime', name: 'Anime', icon: '🗾', desc: 'Japanese animation style' },
    { id: 'minimal', name: 'Minimalist', icon: '✨', desc: 'Clean, simple, elegant' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌃', desc: 'Neon, futuristic, sci-fi' },
];

export default function CreateForm() {
    // Inputs
    const [keyword, setKeyword] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('realistic');
    const [duration, setDuration] = useState('15');
    const [aspectRatio, setAspectRatio] = useState('9:16');
    const [language, setLanguage] = useState('th');

    // Stages
    const [step, setStep] = useState<'input' | 'preview' | 'generating' | 'completed'>('input');
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    // Data
    const [generatedContent, setGeneratedContent] = useState<GeminiResponse | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // 1. Generate Metadata (Gemini)
    const handleGenerateConcept = async () => {
        if (!keyword) return;
        setStep('generating'); // Reuse generating state for initial loading or add 'loading-concept'
        setError(null);

        try {
            const res = await fetch('/api/ai/generate-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword, style: selectedStyle, language, duration, aspectRatio })
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setGeneratedContent(data);
            setStep('preview');
        } catch (e: any) {
            setError(e.message || 'Failed to generate concept');
            setStep('input');
        }
    };

    // 2. Start Video Rendering (Kie.ai)
    const handleStartRendering = async () => {
        if (!generatedContent) return;
        setStep('generating');
        setError(null);

        try {
            const res = await fetch('/api/ai/create-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: generatedContent.prompt,
                    duration,
                    aspectRatio
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setTaskId(data.taskId);
            // Start Polling
            startPolling(data.taskId);

        } catch (e: any) {
            setError(e.message || 'Failed to start rendering');
            setStep('preview');
        }
    }

    // 3. Poll Status
    const startPolling = (tid: string) => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

        pollIntervalRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/api/ai/check-status?taskId=${tid}`);
                const data: KieJobResponse = await res.json();

                if (data.status === 'completed' && data.videoUrl) {
                    setVideoUrl(data.videoUrl);
                    setStep('completed');
                    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                } else if (data.status === 'failed') {
                    setError('Video generation failed at provider.');
                    setStep('preview'); // Allow retry
                    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                }
                // Else: keep processing
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 3000); // Check every 3s
    }

    // Cleanup
    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
    }, []);


    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <ScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                videoTitle={generatedContent?.prompt ? `Video: ${keyword}` : undefined}
            />

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
                    ❌ {error}
                </div>
            )}

            {/* STEP 1: INPUTS (Only show when not generating final video) */}
            {(step === 'input' || step === 'generating' && !taskId || step === 'preview') && (
                <div className={`space-y-8 ${step === 'preview' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <section className="space-y-4">
                        <label className="text-lg font-semibold text-slate-200">What's your video about?</label>
                        <div className="relative">
                            <textarea
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                disabled={step !== 'input'}
                                placeholder="e.g. A cat drinking coffee on a rainy day..."
                                className="w-full h-32 bg-slate-800 border-2 border-slate-700 rounded-xl p-4 text-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none resize-none"
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-slate-500 flex items-center gap-1">
                                <Sparkles size={12} /> AI Enhanced
                            </div>
                        </div>
                    </section>

                    {/* Style Selector */}
                    <section className="space-y-4">
                        <label className="text-lg font-semibold text-slate-200">Choose a Style</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {VIDEO_STYLES.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    disabled={step !== 'input'}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedStyle === style.id
                                        ? 'bg-red-500/10 border-red-500 md:scale-105'
                                        : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{style.icon}</div>
                                    <div className={`font-bold ${selectedStyle === style.id ? 'text-red-400' : 'text-slate-200'}`}>
                                        {style.name}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">{style.desc}</div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Settings */}
                    <section className="p-6 bg-slate-900 rounded-xl border border-slate-800 space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Settings size={20} className="text-slate-400" />
                            <h3 className="text-lg font-semibold text-slate-200">Composition Settings</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Duration */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                    <Clock size={16} /> Duration
                                </label>
                                <div className="flex bg-slate-800 p-1 rounded-lg">
                                    {['10', '15'].map((dur) => (
                                        <button
                                            key={dur}
                                            onClick={() => setDuration(dur)}
                                            disabled={step !== 'input'}
                                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${duration === dur ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                                                }`}
                                        >
                                            {dur}s
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ratio */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                    <Smartphone size={16} /> Aspect Ratio
                                </label>
                                <div className="flex bg-slate-800 p-1 rounded-lg">
                                    {[
                                        { id: '9:16', icon: <Smartphone size={18} />, label: '9:16' },
                                        { id: '16:9', icon: <Monitor size={18} />, label: '16:9' },
                                        { id: '1:1', icon: <Square size={18} />, label: '1:1' },
                                    ].map((ratio) => (
                                        <button
                                            key={ratio.id}
                                            onClick={() => setAspectRatio(ratio.id)}
                                            disabled={step !== 'input'}
                                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${aspectRatio === ratio.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                                                }`}
                                        >
                                            {ratio.icon} <span className="hidden sm:inline">{ratio.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Language */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                    <Globe size={16} /> Language
                                </label>
                                <div className="flex bg-slate-800 p-1 rounded-lg">
                                    {[
                                        { id: 'th', label: 'Thai 🇹🇭' },
                                        { id: 'en', label: 'English 🇺🇸' },
                                    ].map((lang) => (
                                        <button
                                            key={lang.id}
                                            onClick={() => setLanguage(lang.id)}
                                            disabled={step !== 'input'}
                                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${language === lang.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                                                }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* LOADING STATE (Concept) */}
            {step === 'generating' && !taskId && (
                <div className="py-20 text-center space-y-4">
                    <Loader2 className="animate-spin text-red-500 w-12 h-12 mx-auto" />
                    <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Analyzing & Imagineering...</h3>
                    <p className="text-slate-400">Gemini is crafting the perfect prompt for you.</p>
                </div>
            )}


            {/* STEP 2: PREVIEW & APPROVAL */}
            {step === 'preview' && generatedContent && (
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 space-y-6 shadow-2xl">
                    <div className="border-l-4 border-red-500 pl-4">
                        <h2 className="text-2xl font-bold text-white mb-1">Concept Ready! 🎬</h2>
                        <p className="text-slate-400">Review the AI-generated plan before rendering.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-black/40 p-4 rounded-lg">
                            <label className="text-xs uppercase tracking-wider text-slate-500 mb-2 block">Video Prompt (Sent to Sora)</label>
                            <p className="text-slate-200 font-mono text-sm leading-relaxed">{generatedContent.prompt}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-black/40 p-4 rounded-lg">
                                <label className="text-xs uppercase tracking-wider text-slate-500 mb-2 block">Caption</label>
                                <p className="text-slate-200 text-sm whitespace-pre-wrap">{generatedContent.caption}</p>
                            </div>
                            <div className="bg-black/40 p-4 rounded-lg">
                                <label className="text-xs uppercase tracking-wider text-slate-500 mb-2 block">Hashtags</label>
                                <div className="flex flex-wrap gap-2">
                                    {generatedContent.hashtags.map(tag => (
                                        <span key={tag} className="text-blue-400 text-sm">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={() => setStep('input')}
                            className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
                        >
                            Edit Concept
                        </button>
                        <button
                            onClick={handleStartRendering}
                            className="flex-2 w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-900/30 flex items-center justify-center gap-2"
                        >
                            <PlayCircle size={24} /> Start Rendering Video
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: RENDERING STATUS */}
            {taskId && step !== 'completed' && (
                <div className="py-20 text-center space-y-6 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Creating Magic...</h3>
                        <p className="text-slate-400 animate-pulse">Sora is generating your {duration}s video. This usually takes 1-2 minutes.</p>
                        <div className="text-xs text-slate-600 mt-4 font-mono">Task ID: {taskId}</div>
                    </div>
                </div>
            )}

            {/* STEP 4: RESULT */}
            {step === 'completed' && videoUrl && (
                <div className="bg-slate-900 border border-green-500/30 rounded-xl overflow-hidden shadow-2xl">
                    <div className="bg-green-500/10 p-4 flex items-center gap-3 border-b border-green-500/20">
                        <CheckCircle className="text-green-500" />
                        <span className="font-bold text-green-400">Video Generated Successfully!</span>
                    </div>
                    <div className="p-8 aspect-video flex items-center justify-center bg-black">
                        <video controls className="max-h-full max-w-full rounded-lg shadow-2xl" src={videoUrl} autoPlay loop />
                    </div>
                    <div className="p-6 bg-slate-900 flex justify-between items-center">
                        <div className="text-slate-400 text-sm">Stored in temporary storage. Upload to Drive to save permanently.</div>
                        <button
                            onClick={() => setIsScheduleModalOpen(true)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-900/20"
                        >
                            Go to Schedule Post →
                        </button>
                    </div>
                </div>
            )}

            {/* INITIAL ACTION BUTTON */}
            {step === 'input' && (
                <button
                    onClick={handleGenerateConcept}
                    disabled={!keyword}
                    className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl text-white font-bold text-xl shadow-lg shadow-red-900/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Generate Concept ✨
                </button>
            )}

        </div>
    );
}
