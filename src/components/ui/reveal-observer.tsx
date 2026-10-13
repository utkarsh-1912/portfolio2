'use client';

import { useEffect } from 'react';

/**
 * Watches every element with a `data-reveal` attribute and sets `data-in`
 * once it scrolls into view. The actual animation lives in globals.css.
 * A MutationObserver picks up elements added later (route changes, Suspense).
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-in', '');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );

    const scan = (root: ParentNode) => {
      root.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => io.observe(el));
    };

    scan(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches('[data-reveal]:not([data-in])')) io.observe(node);
          scan(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
