'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type Entry = { id: number; degree: string; institution: string; duration: string; description: string; icon: string };
type Filter = 'all' | 'work' | 'education';

/** Organisation name for matching, ignoring case, spacing and punctuation. */
const orgKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '');

/**
 * Groups back-to-back work entries at the same organisation (the list is newest first), so a
 * promotion reads as one company with a progression of roles rather than separate jobs.
 */
function groupRoles(items: Entry[]): Entry[][] {
    const groups: Entry[][] = [];
    for (const item of items) {
        const last = groups[groups.length - 1];
        if (last && item.icon === 'Briefcase' && last[0].icon === 'Briefcase' && orgKey(last[0].institution) === orgKey(item.institution)) last.push(item);
        else groups.push([item]);
    }
    return groups;
}

/** "Jul 2024 - Present" from the oldest role's start to the newest role's end. */
function span(group: Entry[]) {
    const start = group[group.length - 1].duration.split(/\s*[-–—]\s*|\s+to\s+/i)[0];
    const end = group[0].duration.split(/\s*[-–—]\s*|\s+to\s+/i)[1] ?? 'Present';
    return `${start} - ${end}`;
}

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
                    {groupRoles(shown).map((group) => {
                        const [first] = group;
                        const promoted = group.length > 1;
                        return (
                            <li
                                key={first.id}
                                data-reveal="up"
                                className="group grid gap-3 border-b border-border py-8 transition-colors animate-in fade-in duration-500 md:grid-cols-12 md:gap-8 md:pl-10 md:hover:bg-muted/40"
                            >
                                <div className="md:col-span-3">
                                    <p className="font-mono text-sm tabular-nums text-foreground">{promoted ? span(group) : first.duration}</p>
                                    <p className="eyebrow mt-1">{isWork(first) ? 'Work' : 'Education'}</p>
                                </div>
                                {promoted ? (
                                    <div className="md:col-span-9">
                                        <p className="font-headline text-2xl font-semibold tracking-tight text-foreground">{first.institution}</p>
                                        {/* Newest role first, joined by a line to show the progression */}
                                        <ol className="relative mt-5 space-y-6 border-l border-border pl-6">
                                            {group.map((role, i) => (
                                                <li key={role.id} className="relative grid gap-2 md:grid-cols-9 md:gap-8">
                                                    <span aria-hidden="true" className={cn('absolute -left-[29px] top-2 h-2.5 w-2.5 rounded-full border border-primary', i === 0 ? 'bg-primary' : 'bg-background')} />
                                                    <div className="md:col-span-4">
                                                        <h3 className="font-headline text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                                            {role.degree}
                                                        </h3>
                                                        <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
                                                            {role.duration}
                                                            {i === 0 && <span className="ml-2 rounded-full border border-primary/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">Promoted</span>}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-muted-foreground md:col-span-5 md:text-base">{role.description}</p>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                ) : (
                                    <>
                                        <div className="md:col-span-4">
                                            <h3 className="font-headline text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                                {first.degree}
                                            </h3>
                                            <p className="mt-1 text-muted-foreground">{first.institution}</p>
                                        </div>
                                        <p className="text-sm leading-relaxed text-muted-foreground md:col-span-5 md:text-base">{first.description}</p>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </>
    );
}
