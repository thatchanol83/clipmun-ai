import { NextResponse } from 'next/server';
import { checkJobStatus } from '@/services/kie';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
        return NextResponse.json({ error: 'TaskId is required' }, { status: 400 });
    }

    try {
        const data = await checkJobStatus(taskId);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
    }
}
