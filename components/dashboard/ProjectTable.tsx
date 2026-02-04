import { useState, useEffect } from 'react';
import { Youtube, Facebook, Calendar, ArrowUp, Loader2, Video } from 'lucide-react';

interface Project {
    id: number;
    title: string;
    video_url: string;
    status: string;
    scheduled_for: string | null;
    platforms: string[];
    created_at: string;
}

export default function ProjectTable() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/content/list');
                const data = await res.json();
                if (data.data) {
                    setProjects(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex justify-center">
                <Loader2 className="animate-spin text-slate-500" />
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
                <div className="mb-2">No videos yet</div>
                <div className="text-xs opacity-70">Create your first video to see it here!</div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    Recent Projects <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">Live</span>
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 uppercase tracking-wider text-xs border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 font-medium text-slate-300">Video Title</th>
                            <th className="px-6 py-4 font-medium text-slate-300">Status</th>
                            <th className="px-6 py-4 font-medium text-slate-300">Scheduled For</th>
                            <th className="px-6 py-4 font-medium text-slate-300">Platforms</th>
                            <th className="px-6 py-4 font-medium text-slate-300">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <Video size={16} className="text-slate-500" />
                                        </div>
                                        <div className="max-w-[200px] truncate" title={project.title}>
                                            {project.title}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${project.status === 'posted' ? 'bg-green-500/10 text-green-500' :
                                            project.status === 'scheduled' ? 'bg-blue-500/10 text-blue-500' :
                                                project.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-slate-700/50 text-slate-400'
                                        }`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {project.scheduled_for ? (
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Calendar size={14} />
                                            {new Date(project.scheduled_for).toLocaleString()}
                                        </div>
                                    ) : (
                                        <span className="text-slate-600">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {project.platforms?.includes('youtube') && <Youtube size={16} className="text-red-500" />}
                                        {project.platforms?.includes('facebook') && <Facebook size={16} className="text-blue-500" />}
                                        {(!project.platforms || project.platforms.length === 0) && '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
