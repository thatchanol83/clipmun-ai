import Sidebar from '@/components/layout/Sidebar';
import AccountCard from '@/components/settings/AccountCard';
import { Youtube, Facebook, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg"><SettingsIcon /></div>
                        Settings
                    </h1>
                    <p className="text-slate-400">Manage your connected accounts and preferences.</p>
                </header>

                <section className="space-y-6">
                    <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-800 pb-2">Connected Accounts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AccountCard
                            platform="YouTube"
                            icon={<Youtube size={24} className="text-red-500" />}
                            accountName="My Awesome Channel"
                            isConnected={true}
                        />
                        <AccountCard
                            platform="Facebook"
                            icon={<Facebook size={24} className="text-blue-500" />}
                        />
                    </div>
                </section>

                <section className="mt-12 space-y-6">
                    <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-800 pb-2">General Preferences</h2>
                    {/* Placeholders for future settings */}
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center text-slate-500">
                        More settings coming soon...
                    </div>
                </section>

            </main>
        </div>
    );
}
