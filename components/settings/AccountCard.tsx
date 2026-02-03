'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface AccountCardProps {
    platform: 'Facebook' | 'YouTube';
    icon: React.ReactNode;
    accountName?: string; // If connected
    isConnected?: boolean;
}

export default function AccountCard({ platform, icon, accountName, isConnected = false }: AccountCardProps) {
    const [connected, setConnected] = useState(isConnected);

    const handleToggle = () => {
        // Mock OAuth flow
        if (!connected) {
            const w = window.open('', '_blank', 'width=500,height=600');
            if (w) {
                w.document.write(`<h1>Connecting to ${platform}...</h1><p>Please close this window to simulate success.</p>`);
                setTimeout(() => {
                    w.close();
                    setConnected(true);
                }, 1500);
            }
        } else {
            setConnected(false);
        }
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-[200px] transition-all hover:border-slate-700">
            <div className="flex justify-between items-start">
                <div className="bg-slate-800 p-3 rounded-lg text-white">
                    {icon}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${connected ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-slate-400'}`}>
                    {connected ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {connected ? 'Active' : 'Disconnected'}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-slate-200">{platform}</h3>
                <p className="text-sm text-slate-500">{connected ? `Connected as ${accountName || 'User'}` : 'Not connected'}</p>
            </div>

            <button
                onClick={handleToggle}
                className={`w-full py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${connected
                        ? 'bg-slate-800 text-slate-300 hover:bg-red-500/10 hover:text-red-500'
                        : 'bg-white text-slate-900 hover:bg-slate-200'
                    }`}
            >
                {connected ? 'Disconnect Account' : `Connect ${platform}`}
                {!connected && <ExternalLink size={14} />}
            </button>
        </div>
    );
}
