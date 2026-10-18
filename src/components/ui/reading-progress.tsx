'use client';

import { useEffect, useState } from 'react';

/** Thin bar under the header showing how far through the article the reader is. */
export function ReadingProgress({ targetId }: { targetId: string }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const el = document.getElementById(targetId);
        if (!el) return;
        let frame = 0;
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const rect = el.getBoundingClientRect();
                const total = rect.height - window.innerHeight;
                setProgress(total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total)));
            });
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, [targetId]);

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
            <div className="h-full origin-left bg-primary" style={{ transform: `scaleX(${progress})` }} />
        </div>
    );
}
