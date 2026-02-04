import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const envVars = Object.keys(process.env).sort();

    // Filter for relevant keys to check existence (don't show values for security)
    const postgresVars = envVars.filter(key => key.startsWith('POSTGRES_')).reduce((acc, key) => {
        acc[key] = process.env[key] ? (key === 'POSTGRES_URL' ? 'Present (starts with postgres://...)' : 'Present') : 'Missing';
        // Basic check for value format
        if (key === 'POSTGRES_URL' && process.env[key] && !process.env[key]?.startsWith('postgres://')) {
            acc[key] = 'Invalid Format (does not start with postgres://)';
        }
        return acc;
    }, {} as Record<string, string>);

    const authVars = {
        AUTH_SECRET: process.env.AUTH_SECRET ? 'Present' : 'Missing',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'Present' : 'Missing',
    };

    return NextResponse.json({
        message: "Environment Variable Debug",
        postgres: postgresVars,
        auth: authVars,
        allKeys: envVars.filter(k => k.startsWith('NEXT_') || k.startsWith('VERCEL_')),
        timestamp: new Date().toISOString()
    });
}
