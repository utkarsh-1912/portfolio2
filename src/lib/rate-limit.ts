import { headers } from 'next/headers';

// Simple in-memory sliding-window limiter. It is per server instance, so on serverless
// hosting each instance counts separately; it still stops bursts from a single client.
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterMs: number } {
    const now = Date.now();
    const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
    if (hits.length >= limit) {
        buckets.set(key, hits);
        return { ok: false, retryAfterMs: windowMs - (now - hits[0]) };
    }
    hits.push(now);
    buckets.set(key, hits);

    // Keep the map from growing forever
    if (buckets.size > 5000) {
        for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
    return { ok: true, retryAfterMs: 0 };
}

/** Forget a key's history, e.g. after a successful login. */
export function resetRateLimit(key: string) {
    buckets.delete(key);
}

/** Best-effort client IP from proxy headers. */
export async function clientIp(): Promise<string> {
    const h = await headers();
    return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}
