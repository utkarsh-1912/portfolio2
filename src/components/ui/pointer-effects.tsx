'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]';
const MAGNET_STRENGTH = 0.3;

/**
 * Desktop-only pointer polish:
 * - a ring that trails the pointer, grows over interactive elements and shows
 *   a label for elements with `data-cursor="View"`;
 * - "magnetic" elements (`data-magnetic`) that lean toward the pointer;
 * - a soft light that follows the pointer over `data-spotlight` cards.
 * The native cursor stays visible. Disabled for touch, reduced motion and the admin.
 */
export function PointerEffects() {
    const pathname = usePathname();
    const ring = useRef<HTMLDivElement>(null);
    const [enabled, setEnabled] = useState(false);
    const [label, setLabel] = useState('');
    const [active, setActive] = useState(false);
    const [visible, setVisible] = useState(false);

    const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/login');

    useEffect(() => {
        const query = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
        const update = () => setEnabled(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (!enabled || isAdmin) return;

        const target = { x: -100, y: -100 };
        const pos = { x: -100, y: -100 };
        let frame = 0;
        let magnet: HTMLElement | null = null;

        const releaseMagnet = () => {
            if (!magnet) return;
            magnet.style.translate = '';
            magnet = null;
        };

        const onMove = (e: PointerEvent) => {
            target.x = e.clientX;
            target.y = e.clientY;
            setVisible(true);

            const el = e.target instanceof Element ? e.target : null;
            const hit = el?.closest<HTMLElement>(INTERACTIVE);
            setActive(!!hit);
            setLabel(el?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? '');

            const spot = el?.closest<HTMLElement>('[data-spotlight]');
            if (spot) {
                const sr = spot.getBoundingClientRect();
                spot.style.setProperty('--mx', `${e.clientX - sr.left}px`);
                spot.style.setProperty('--my', `${e.clientY - sr.top}px`);
            }

            const nextMagnet = el?.closest<HTMLElement>('[data-magnetic]') ?? null;
            if (nextMagnet !== magnet) releaseMagnet();
            if (nextMagnet) {
                magnet = nextMagnet;
                const r = magnet.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                magnet.style.translate = `${dx * MAGNET_STRENGTH}px ${dy * MAGNET_STRENGTH}px`;
            }
        };

        const onLeave = () => {
            setVisible(false);
            releaseMagnet();
        };

        const tick = () => {
            // Ease toward the pointer for a soft trailing feel
            pos.x += (target.x - pos.x) * 0.2;
            pos.y += (target.y - pos.y) * 0.2;
            if (ring.current) ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);

        window.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
        return () => {
            cancelAnimationFrame(frame);
            releaseMagnet();
            window.removeEventListener('pointermove', onMove);
            document.documentElement.removeEventListener('pointerleave', onLeave);
        };
    }, [enabled, isAdmin]);

    if (!enabled || isAdmin) return null;

    return (
        <div
            ref={ring}
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[101] hidden md:block"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
        >
            <div
                className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-primary/70 font-mono text-[10px] uppercase tracking-widest text-primary-foreground transition-[width,height,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                    width: label ? 84 : active ? 48 : 28,
                    height: label ? 84 : active ? 48 : 28,
                    backgroundColor: label ? 'hsl(var(--primary))' : active ? 'hsl(var(--primary) / 0.12)' : 'transparent',
                }}
            >
                {label}
            </div>
        </div>
    );
}
