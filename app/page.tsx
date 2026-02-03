import Sidebar from '@/components/layout/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import ProjectTable from '@/components/dashboard/ProjectTable';
import { Plus } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Top Header/Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard title="Subscribers" value="21,064" color="red" />
          <StatCard title="Views" value="2,640,625" color="red" />
          <StatCard title="Followers" value="131,674" color="blue" />
          <StatCard title="FB Views" value="14,480,569" color="blue" />
        </div>

        {/* Global Action Bar */}
        <div className="flex gap-4 mb-8">
          <button className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white p-4 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold shadow-lg shadow-red-900/20 transition-all transform hover:scale-[1.01]">
            <div className="bg-white/20 p-1 rounded-md">
              <Plus size={24} />
            </div>
            <div>
              <div className="leading-none">Create Video</div>
              <div className="text-xs font-normal opacity-80 mt-0.5 text-left">Generate content</div>
            </div>
          </button>

          <div className="w-64 bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-teal-500/10 text-teal-500 p-2 rounded-lg">
              <Plus size={20} />
            </div>
            <div>
              <div className="font-medium">Queue</div>
              <div className="text-xs text-slate-400">View status</div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <ProjectTable />
        </div>
      </main>
    </div>
  );
}
