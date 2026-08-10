'use client';

import { useEffect } from 'react';

export function ScrollSnapper() {
  useEffect(() => {
    // Apply snap scrolling classes to the root element only for this page
    const html = document.documentElement;
    html.classList.add('snap-y', 'snap-mandatory', 'scroll-smooth');
    
    return () => {
      // Clean up when leaving the page
      html.classList.remove('snap-y', 'snap-mandatory', 'scroll-smooth');
    };
  }, []);

  return null;
}
