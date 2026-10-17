import { NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, createSessionToken, safeEqual } from '@/lib/auth';
import { clientIp, rateLimit, resetRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    try {
        // 5 attempts per IP per 15 minutes; a successful login clears the count
        const limitKey = `login:${await clientIp()}`;
        const limit = rateLimit(limitKey, 5, 15 * 60 * 1000);
        if (!limit.ok) {
            const minutes = Math.ceil(limit.retryAfterMs / 60000);
            return NextResponse.json(
                { success: false, message: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.` },
                { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } }
            );
        }

        const { password } = await request.json();

        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            console.error('ADMIN_PASSWORD environment variable is not set.');
            return NextResponse.json(
                { success: false, message: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (typeof password === 'string' && (await safeEqual(password, adminPassword))) {
            resetRateLimit(limitKey);
            const response = NextResponse.json({ success: true }, { status: 200 });

            // HttpOnly cookie holding a signed, expiring session token
            response.cookies.set(SESSION_COOKIE, await createSessionToken(), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: SESSION_MAX_AGE_SECONDS,
                path: '/',
            });

            return response;
        }

        // Small fixed delay to slow down password guessing
        await new Promise((resolve) => setTimeout(resolve, 500));
        return NextResponse.json(
            { success: false, message: 'Invalid password' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Bad request' },
            { status: 400 }
        );
    }
}
