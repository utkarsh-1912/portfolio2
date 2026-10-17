'use client';

import { useEffect, useState } from 'react';

const SEEN_KEY = 'utkristi-intro';
const MIN_MS = 1400;
export const INTRO_DONE_EVENT = 'intro:done';

/**
 * First-visit intro: the </> mark draws itself while a counter runs to 100, then the
 * panel lifts away. Visibility is decided before paint by the inline script in the root
 * layout (it adds `intro-active` to <html>), so returning visitors never see a flash.
 */
export function IntroLoader() {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<'loading' | 'exit' | 'done'>('loading');

    useEffect(() => {
        const html = document.documentElement;
        if (!html.classList.contains('intro-active')) {
            setPhase('done');
            return;
        }

        // Lock scrolling from JS (not CSS) so a failed script can never leave the page stuck
        html.style.overflow = 'hidden';
        let frame = 0;
        const start = performance.now();
        // Finish once fonts are ready (so the hero doesn't reflow) and the minimum time has passed
        let ready = false;
        document.fonts?.ready.then(() => { ready = true; }) ?? (ready = true);

        const tick = (now: number) => {
            const t = Math.min((now - start) / MIN_MS, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setProgress(Math.round((ready ? eased : Math.min(eased, 0.9)) * 100));
            if (t < 1 || !ready) {
                frame = requestAnimationFrame(tick);
                return;
            }
            setProgress(100);
            setTimeout(() => {
                setPhase('exit');
                html.style.overflow = '';
                html.classList.remove('intro-active');
                window.dispatchEvent(new Event(INTRO_DONE_EVENT));
                try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* storage unavailable */ }
                setTimeout(() => setPhase('done'), 1000);
            }, 250);
        };
        frame = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(frame);
            html.style.overflow = '';
        };
    }, []);

    if (phase === 'done') return null;

    return (
        <div aria-hidden="true" className={`intro-loader ${phase === 'exit' ? 'intro-exit' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-20 w-20 sm:h-28 sm:w-28">
                <path pathLength={1} d="m6 8-4 4 4 4" className="intro-draw stroke-foreground" />
                <path pathLength={1} d="m18 16 4-4-4-4" className="intro-draw stroke-foreground [animation-delay:150ms]" />
                <path pathLength={1} d="m14.5 4-5 16" className="intro-draw stroke-primary [animation-delay:400ms]" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 sm:p-10">
                <span className="font-headline text-6xl font-semibold tabular-nums tracking-tight sm:text-8xl">{progress}</span>
                <span className="eyebrow pb-2">Utkarsh Gupta · Portfolio</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-border">
                <div className="h-full bg-foreground transition-[width] duration-100" style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}
