import { NextResponse } from 'next/server';
import { generateVideoContent } from '@/services/gemini';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { keyword, style, language, duration, aspectRatio } = body;

        if (!keyword) {
            return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
        }

        const data = await generateVideoContent(keyword, style || 'realistic', language || 'th', duration || '15', aspectRatio || '9:16');

        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}
