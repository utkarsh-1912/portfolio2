'use client';

import { sendGAEvent } from '@next/third-parties/google';

/**
 * Records a Google Analytics event when Analytics is configured (NEXT_PUBLIC_GA_ID);
 * a no-op otherwise, so call sites never need to check.
 */
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
    if (!process.env.NEXT_PUBLIC_GA_ID || typeof window === 'undefined') return;
    try {
        sendGAEvent('event', name, params);
    } catch {
        /* analytics must never break the page */
    }
}
