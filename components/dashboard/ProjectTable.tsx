import { Youtube, Facebook, Calendar, ArrowUp } from 'lucide-react';

const MOCK_PROJECTS = [
    { id: 1, name: 'Thai History Channel', subs: '59', subGrowth: '+5', views: '98.8K', viewGrowth: '+3.8K', videos: '82', followers: '61.5K', fbViews: '23.3K', lastScheduled: 'Today 20:31' },
    { id: 2, name: 'Cryptid Explorer', subs: '75', subGrowth: '+2', views: '46.8K', viewGrowth: '+2.0K', videos: '72', followers: '55.3K', fbViews: '14.4M', lastScheduled: 'Today 21:00' },
    { id: 3, name: 'Viral Shorts Daily', subs: '336', subGrowth: '+11', views: '23.2K', viewGrowth: '+6.5K', videos: '11', followers: '10.4K', fbViews: '2.0K', lastScheduled: 'Today 20:00' },
    { id: 4, name: 'Healthy Tips', subs: '49', subGrowth: '+2.7K', views: '42.5K', viewGrowth: '+2.7K', videos: '51', followers: '1.7K', fbViews: '6.4K', lastScheduled: 'Today 20:05' },
];

export default function ProjectTable() {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    Projects <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">Update 7 mins ago</span>
                </h3>
                <div className="flex gap-2">
                    {/* Filters could go here */}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 uppercase tracking-wider text-xs border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 font-medium text-slate-300">Project</th>
                            <th className="px-6 py-4 font-medium text-red-400">Youtube Subs</th>
                            <th className="px-6 py-4 font-medium text-red-400">Views</th>
                            <th className="px-6 py-4 font-medium text-slate-300">Videos</th>
                            <th className="px-6 py-4 font-medium text-blue-400">FB Followers</th>
                            <th className="px-6 py-4 font-medium text-blue-400">FB Views</th>
                            <th className="px-6 py-4 font-medium text-slate-300">Last Scheduled</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {MOCK_PROJECTS.map((project) => (
                            <tr key={project.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gradient-to-br from-slate-700 to-slate-600"></div>
                                        {project.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-200">{project.subs}</div>
                                    <div className="text-xs text-green-500 flex items-center gap-0.5">{project.subGrowth}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-200">{project.views}</div>
                                    <div className="text-xs text-green-500 flex items-center gap-0.5">{project.viewGrowth} <ArrowUp size={10} /></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-200">{project.videos}</div>
                                    <div className="text-xs text-green-500">+3</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-200">{project.followers}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-200">{project.fbViews}</div>
                                    <div className="text-xs text-green-500 flex items-center gap-0.5">+383</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 text-xs">
                                        <div className="flex items-center gap-1 text-red-400"><Youtube size={12} /> <span>{project.lastScheduled}</span></div>
                                        <div className="flex items-center gap-1 text-blue-400"><Facebook size={12} /> <span>{project.lastScheduled}</span></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
