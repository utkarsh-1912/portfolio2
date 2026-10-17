'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type Entry = { id: number; degree: string; institution: string; duration: string; description: string; icon: string };
type Filter = 'all' | 'work' | 'education';

/** Experience timeline with All / Work / Education filters. */
export function TimelineList({ items }: { items: Entry[] }) {
    const [filter, setFilter] = useState<Filter>('all');
    const isWork = (e: Entry) => e.icon === 'Briefcase';
    const counts = { all: items.length, work: items.filter(isWork).length, education: items.filter((e) => !isWork(e)).length };
    const shown = items.filter((e) => filter === 'all' || (filter === 'work') === isWork(e));

    return (
        <>
            <div role="tablist" aria-label="Filter timeline" className="mb-10 flex flex-wrap gap-2">
                {(['all', 'work', 'education'] as const).map((f) => (
                    <button
                        key={f}
                        type="button"
                        role="tab"
                        aria-selected={filter === f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            'rounded-full border px-4 py-1.5 text-sm capitalize transition-colors',
                            filter === f ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                        )}
                    >
                        {f} <span className="ml-1 font-mono text-xs opacity-60">{counts[f]}</span>
                    </button>
                ))}
            </div>

            <div className="relative">
                {/* Progress rule that draws down as the list scrolls through */}
                <span aria-hidden="true" className="absolute left-0 top-0 hidden h-full w-px bg-border md:block" />
                <span aria-hidden="true" className="scroll-grow-y absolute left-0 top-0 hidden h-full w-px bg-primary md:block" />

                <ol>
                    {shown.map((item) => (
                        <li
                            key={item.id}
                            data-reveal="up"
                            className="group grid gap-3 border-b border-border py-8 transition-colors animate-in fade-in duration-500 md:grid-cols-12 md:gap-8 md:pl-10 md:hover:bg-muted/40"
                        >
                            <div className="md:col-span-3">
                                <p className="font-mono text-sm tabular-nums text-foreground">{item.duration}</p>
                                <p className="eyebrow mt-1">{isWork(item) ? 'Work' : 'Education'}</p>
                            </div>
                            <div className="md:col-span-4">
                                <h3 className="font-headline text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                    {item.degree}
                                </h3>
                                <p className="mt-1 text-muted-foreground">{item.institution}</p>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground md:col-span-5 md:text-base">{item.description}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </>
    );
}
