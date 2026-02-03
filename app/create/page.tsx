import Sidebar from '@/components/layout/Sidebar';
import CreateForm from '@/components/create/CreateForm';

export default function CreatePage() {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create New Video</h1>
                    <p className="text-slate-400">Design your content and let AI handle the rest.</p>
                </header>

                <CreateForm />
            </main>
        </div>
    );
}
