'use client';

import { useLayoutEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Scales its content's font-size so the text spans the full container width,
 * like the full-bleed name wordmark on eddyrlora.com.
 */
export function FitText({ children, className }: { children: React.ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;

    const fit = () => {
      i.style.fontSize = '100px';
      // Glyph widths don't scale perfectly linearly, so keep a small margin to avoid overflow
      const ratio = (o.clientWidth / i.scrollWidth) * 0.985;
      i.style.fontSize = `${Math.floor(100 * ratio * 100) / 100}px`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className={cn('w-full', className)}>
      <div ref={inner} className="inline-block whitespace-nowrap text-[11vw]">
        {children}
      </div>
    </div>
  );
}
