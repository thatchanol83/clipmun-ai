import Sidebar from '@/components/layout/Sidebar';
import CalendarView from '@/components/calendar/CalendarView';

export default function CalendarPage() {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
                        <p className="text-slate-400">Manage your scheduled posts across all platforms.</p>
                    </div>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                        Sync with Google Calendar
                    </button>
                </header>

                <CalendarView />
            </main>
        </div>
    );
}
