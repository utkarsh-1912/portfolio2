'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

/**
 * Terminal-style "decode" effect: characters cycle through glyphs and settle
 * left to right the first time the text scrolls into view.
 */
export function ScrambleText({ text, className, duration = 700 }: { text: string; className?: string; duration?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState(text);

    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let frame = 0;
        const run = () => {
            const start = performance.now();
            const tick = (now: number) => {
                const progress = Math.min((now - start) / duration, 1);
                const settled = Math.floor(progress * text.length);
                setDisplay(
                    text
                        .split('')
                        .map((ch, i) => (i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
                        .join('')
                );
                if (progress < 1) frame = requestAnimationFrame(tick);
            };
            frame = requestAnimationFrame(tick);
        };

        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                run();
                io.disconnect();
            }
        });
        io.observe(el);
        return () => {
            io.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [text, duration]);

    return (
        <span ref={ref} className={className}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">{display}</span>
        </span>
    );
}
