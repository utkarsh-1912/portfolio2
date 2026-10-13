import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isProtectedApi = path.startsWith('/api/upload') || path.startsWith('/api/seed');
    const isProtected = path.startsWith('/admin') || isProtectedApi;

    if (!isProtected) {
        return NextResponse.next();
    }

    // The cookie must carry a valid signed token, not merely exist
    const authed = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (authed) {
        return NextResponse.next();
    }

    if (isProtectedApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Keep only the path so the login page can't be turned into an open redirect
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path + request.nextUrl.search);
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ['/admin/:path*', '/api/upload/:path*', '/api/seed/:path*'],
};
