'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/**
 * One listener for click analytics: any element with `data-track="event_name"` reports a
 * GA event (with its label and link) when clicked. Does nothing unless Analytics is set up.
 */
export function TrackClicks() {
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_GA_ID) return;
        const onClick = (e: MouseEvent) => {
            const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
            if (!el) return;
            const href = el.getAttribute('href') ?? undefined;
            trackEvent(el.dataset.track!, {
                label: (el.dataset.trackLabel ?? el.textContent ?? '').trim().slice(0, 80),
                ...(href ? { href } : {}),
                page: location.pathname,
            });
        };
        document.addEventListener('click', onClick, true);
        return () => document.removeEventListener('click', onClick, true);
    }, []);
    return null;
}
