import { sql } from '@vercel/postgres';

// Seed data for initial testing
export const SEED_USERS = [
    {
        name: 'Clipmun User',
        email: 'user@example.com',
        password: 'securepassword', // In production, hash this!
    },
];

export async function seedDatabase() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('Created "users" table');

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
                status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, scheduled, posted, failed
                user_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('Created "videos" table');

        return { success: true };
    } catch (error) {
        console.error('Seed Error:', error);
        return { success: false, error };
    }
}

export { sql };
