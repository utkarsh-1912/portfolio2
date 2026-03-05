import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define protected routes
    const isProtected = path.startsWith('/admin') || path.startsWith('/api/portfolio') || path.startsWith('/api/upload');

    // Public assets to ignore
    const isPublicAsset = path.startsWith('/_next') || path.startsWith('/favicon.ico');

    if (!isProtected || isPublicAsset) {
        return NextResponse.next();
    }

    // Check for session cookie
    const session = request.cookies.get('admin_session')?.value;

    if (!session && isProtected) {
        // Redirect to login if accessing protected route without session
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(request.url));
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};
