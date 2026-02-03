
interface StatCardProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
    trend?: string;
    color?: 'red' | 'blue' | 'slate';
}

export default function StatCard({ title, value, color = 'slate' }: StatCardProps) {
    const colorStyles = {
        red: 'bg-red-500/10 border-red-500/20 text-red-500',
        blue: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
        slate: 'bg-slate-800 border-slate-700 text-slate-100',
    };

    const selectedColor = colorStyles[color] || colorStyles.slate;

    return (
        <div className={`p-6 rounded-xl border ${selectedColor} flex flex-col items-center justify-center min-h-[120px]`}>
            <h3 className="text-3xl font-bold mb-1">{value}</h3>
            <p className="text-sm opacity-80 uppercase tracking-wider font-medium">{title}</p>
        </div>
    );
}
