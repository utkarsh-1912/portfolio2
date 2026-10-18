'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/toc';

export function TableOfContents({ items }: { items: TocItem[] }) {
    const [activeId, setActiveId] = useState(items[0]?.id);

    useEffect(() => {
        let frame = 0;

        const updateActiveHeading = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const headings = items
                    .map((item) => document.getElementById(item.id))
                    .filter((heading): heading is HTMLElement => heading instanceof HTMLElement);
                const current = headings.filter((heading) => heading.getBoundingClientRect().top <= 140).at(-1);
                setActiveId(current?.id ?? headings[0]?.id);
            });
        };

        updateActiveHeading();
        window.addEventListener('scroll', updateActiveHeading, { passive: true });
        window.addEventListener('resize', updateActiveHeading);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', updateActiveHeading);
            window.removeEventListener('resize', updateActiveHeading);
        };
    }, [items]);

    return (
        <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28">
                <p className="eyebrow">On this page</p>
                <ol className="mt-4 space-y-2 border-l border-border text-sm">
                    {items.map((item) => {
                        const active = item.id === activeId;
                        return (
                            <li key={item.id} className={item.level === 3 ? 'pl-7' : 'pl-4'}>
                                <a
                                    href={`#${item.id}`}
                                    aria-current={active ? 'location' : undefined}
                                    className={`-ml-px block pl-0 transition-colors ${
                                        active
                                            ? 'border-primary text-foreground'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {item.text}
                                </a>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
}
