'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, Calendar, Settings, Layers, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          MixClip AI
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavItem href="/" icon={<Home size={20} />} label="Dashboard" active={pathname === '/'} />
        <NavItem href="/create" icon={<PlusSquare size={20} />} label="Create Video" active={pathname === '/create'} />
        <NavItem href="/calendar" icon={<Calendar size={20} />} label="Calendar" active={pathname === '/calendar'} />
        <NavItem href="/projects" icon={<Layers size={20} />} label="Projects" active={pathname === '/projects'} />
        <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" active={pathname === '/settings'} />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
          ? 'bg-red-500/10 text-red-500'
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
