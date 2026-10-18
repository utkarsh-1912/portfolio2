'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts from 0 to the number at the start of `value` when it scrolls into view,
 * keeping any suffix ("14d") and thousands separators ("1,031").
 */
export function CountUp({ value, className, duration = 1400 }: { value: string | number; className?: string; duration?: number }) {
    const text = String(value);
    const match = text.match(/^(\d[\d,]*)(.*)$/);
    const target = match ? Number(match[1].replace(/,/g, '')) : NaN;
    const suffix = match?.[2] ?? '';
    const ref = useRef<HTMLSpanElement>(null);
    const [current, setCurrent] = useState<number | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || !Number.isFinite(target) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let frame = 0;
        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            const start = performance.now();
            const tick = (now: number) => {
                const t = Math.min((now - start) / duration, 1);
                // easeOutExpo
                const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                setCurrent(Math.round(target * eased));
                if (t < 1) frame = requestAnimationFrame(tick);
            };
            setCurrent(0);
            frame = requestAnimationFrame(tick);
        });
        io.observe(el);
        return () => {
            io.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [target, duration]);

    const shown = current === null || !Number.isFinite(target) ? text : `${current.toLocaleString('en-US')}${suffix}`;
    return (
        <span ref={ref} className={className}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">{shown}</span>
        </span>
    );
}
