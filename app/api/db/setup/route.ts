import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 1. Create Users Table
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // 2. Create Videos Table (If not exists)
        await sql`
            CREATE TABLE IF NOT EXISTS videos (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                prompt TEXT NOT NULL,
                video_url TEXT,
                caption TEXT,
                hashtags TEXT[],
                platforms TEXT[],
                thumbnail_url TEXT,
                scheduled_for TIMESTAMP WITH TIME ZONE,
                status VARCHAR(50) NOT NULL DEFAULT 'draft',
                user_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // 3. Migration: Add columns if they strictly don't exist (primitive migration)
        // Note: In production, use a real migration tool. This is for quick dev iteration.
        try {
            await sql`ALTER TABLE videos ADD COLUMN IF NOT EXISTS caption TEXT;`;
            await sql`ALTER TABLE videos ADD COLUMN IF NOT EXISTS hashtags TEXT[];`;
            await sql`ALTER TABLE videos ADD COLUMN IF NOT EXISTS platforms TEXT[];`;
            await sql`ALTER TABLE videos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;`;
            await sql`ALTER TABLE videos ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP WITH TIME ZONE;`;
            await sql`ALTER TABLE videos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;`;
        } catch (e) {
            console.log("Migration columns might already exist or error ignored:", e);
        }

        return NextResponse.json({ success: true, message: "Database initialized and migrated" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
