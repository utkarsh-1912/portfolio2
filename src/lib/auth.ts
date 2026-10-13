// Admin session handling. Tokens are `<expiresAtMs>.<hmac>` signed with a server secret,
// so the cookie can't be forged by simply setting `admin_session` to any value.
// Uses Web Crypto only, so it runs in both the Edge middleware and Node server actions.

export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 1 week

const encoder = new TextEncoder();

function getSecret(): string {
    // Prefer a dedicated secret; fall back to the admin password so existing setups keep working.
    // Changing either value invalidates every existing session.
    const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
    if (!secret) throw new Error('ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be set.');
    return secret;
}

function toHex(buf: ArrayBuffer): string {
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmac(value: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(getSecret()),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

/** Compares two strings without leaking where they differ through timing. */
export async function safeEqual(a: string, b: string): Promise<boolean> {
    // Hash first so both inputs have the same length before the constant-time loop.
    const [ha, hb] = await Promise.all([
        crypto.subtle.digest('SHA-256', encoder.encode(a)),
        crypto.subtle.digest('SHA-256', encoder.encode(b)),
    ]);
    const va = new Uint8Array(ha);
    const vb = new Uint8Array(hb);
    let diff = 0;
    for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
    return diff === 0;
}

export async function createSessionToken(): Promise<string> {
    const expiresAt = String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
    return `${expiresAt}.${await hmac(expiresAt)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
    if (!token) return false;
    const [expiresAt, signature] = token.split('.');
    if (!expiresAt || !signature || !/^\d+$/.test(expiresAt)) return false;
    if (Number(expiresAt) < Date.now()) return false;
    try {
        return await safeEqual(signature, await hmac(expiresAt));
    } catch {
        return false;
    }
}
