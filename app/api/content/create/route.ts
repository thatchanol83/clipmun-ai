import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            prompt,
            video_url,
            caption,
            hashtags,
            platforms,
            scheduled_for,
            status,
            thumbnail_url
        } = body;

        // Validation (Basic)
        if (!video_url || !title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Insert into DB
        // Note: We use array strings for hashtags/platforms properly formatted for Postgres
        // But @vercel/postgres usually handles simple arrays if passed correctly or casted.
        // For simplicity with raw SQL templates, we let the driver handle parameterized inputs.

        const result = await sql`
            INSERT INTO videos (
                title, 
                prompt, 
                video_url, 
                caption, 
                hashtags, 
                platforms, 
                scheduled_for, 
                status, 
                thumbnail_url
            )
            VALUES (
                ${title}, 
                ${prompt || ''}, 
                ${video_url}, 
                ${caption || ''}, 
                ${hashtags || []}, 
                ${platforms || []}, 
                ${scheduled_for || null}, 
                ${status || 'draft'}, 
                ${thumbnail_url || null}
            )
            RETURNING id;
        `;

        return NextResponse.json({ success: true, id: result.rows[0].id });

    } catch (error: any) {
        console.error("Create Content Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
