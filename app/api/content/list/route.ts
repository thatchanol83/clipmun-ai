import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch latest projects
        const result = await sql`
            SELECT * FROM videos 
            ORDER BY created_at DESC 
            LIMIT 50;
        `;

        return NextResponse.json({ data: result.rows });

    } catch (error: any) {
        console.error("List Content Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
