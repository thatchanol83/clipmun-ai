import { NextResponse } from 'next/server';
import { createSoraVideoJob } from '@/services/kie';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt, duration, aspectRatio } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const data = await createSoraVideoJob(prompt, duration || '15', aspectRatio || '9:16');

        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to create video task' }, { status: 500 });
    }
}
