import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from './auth';

export async function isAdmin(): Promise<boolean> {
    const store = await cookies();
    return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/**
 * Server actions are callable from any page by their action ID, so the middleware
 * guarding /admin does not protect them. Every admin action must call this first.
 */
export async function requireAdmin(): Promise<void> {
    if (!(await isAdmin())) throw new Error('Unauthorized');
}
