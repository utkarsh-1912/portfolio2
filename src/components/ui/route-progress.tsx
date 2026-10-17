'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Top progress bar for client-side navigations. The App Router has no navigation events,
 * so it starts when an internal link is clicked and completes when the URL changes.
 */
export function RouteProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState<number | null>(null);
    const trickle = useRef<ReturnType<typeof setInterval>>();
    const safety = useRef<ReturnType<typeof setTimeout>>();

    const finish = () => {
        clearInterval(trickle.current);
        clearTimeout(safety.current);
        setProgress((p) => (p === null ? null : 100));
        setTimeout(() => setProgress(null), 350);
    };

    // Start on internal link clicks that lead to a different page
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = (e.target as Element | null)?.closest('a');
            if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
            const url = new URL(a.href, location.href);
            if (url.origin !== location.origin) return;
            // Same page (including hash-only jumps) doesn't trigger a navigation
            if (url.pathname === location.pathname && url.search === location.search) return;

            clearInterval(trickle.current);
            clearTimeout(safety.current);
            setProgress(8);
            // Creep towards 90% while waiting; the real finish comes from the URL change
            trickle.current = setInterval(() => setProgress((p) => (p === null ? p : Math.min(90, p + (90 - p) * 0.12))), 200);
            safety.current = setTimeout(finish, 15000);
        };
        document.addEventListener('click', onClick, true);
        return () => document.removeEventListener('click', onClick, true);
    }, []);

    // Complete when the route has actually changed
    const first = useRef(true);
    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        finish();
    }, [pathname, searchParams]);

    useEffect(() => () => {
        clearInterval(trickle.current);
        clearTimeout(safety.current);
    }, []);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-0 z-[160] h-[3px]"
            style={{ opacity: progress === null ? 0 : 1, transition: 'opacity 300ms ease' }}
        >
            <div
                className="h-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]"
                style={{ width: `${progress ?? 0}%`, transition: progress === 8 ? 'none' : 'width 300ms cubic-bezier(0.22,1,0.36,1)' }}
            />
        </div>
    );
}
