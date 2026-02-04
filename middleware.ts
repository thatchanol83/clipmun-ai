import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    // 1. Update session if it exists (refresh expiry)
    await updateSession(request);

    const currentUser = request.cookies.get('session')?.value;
    const { pathname } = request.nextUrl;

    // 2. Protected Routes Logic
    const protectedRoutes = ['/', '/create', '/calendar', '/settings', '/dashboard'];
    // Check if the current path starts with any of the protected routes
    const isProtectedRoute = protectedRoutes.some(route =>
        // Exact match
        pathname === route ||
        // Sub-path match (but exclude / if checking subpaths like /api)
        (route !== '/' && pathname.startsWith(route))
    );

    // Additional check: protect root '/' specifically if it's in the list
    const isRoot = pathname === '/';

    if ((isProtectedRoute || isRoot) && !currentUser) {
        // Redirect to login
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 3. Prevent logged-in users from seeing /login
    if (pathname === '/login' && currentUser) {
        const url = request.nextUrl.clone();
        url.pathname = '/'; // Go to dashboard
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes) -> Except we might want to protect some API routes later, but login needs public API
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folders
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
    ],
};
