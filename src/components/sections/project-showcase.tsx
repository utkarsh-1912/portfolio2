'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Star, GitFork } from 'lucide-react';
import { ProjectPlaceholder } from './project-placeholder';

export type ShowcaseProject = {
    id: number;
    title: string;
    description: string;
    tags: string[];
    imageUrl: string;
    liveUrl?: string | null;
    githubUrl?: string | null;
    slug?: string | null;
    githubStats?: any | null;
};

/**
 * Desktop scroll scene (after eddyrlora.com): the details panel stays pinned on the left
 * while large previews scroll past on the right; whichever preview is centred is "active".
 */
export function ProjectShowcase({ projects, onOpen }: { projects: ShowcaseProject[]; onOpen: (p: ShowcaseProject) => void }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const slides = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // A thin band across the middle of the viewport decides which slide is active
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActiveIdx(Number((entry.target as HTMLElement).dataset.index));
                }
            },
            { rootMargin: '-45% 0px -45% 0px' }
        );
        slides.current.forEach((el) => el && io.observe(el));
        return () => io.disconnect();
    }, [projects.length]);

    const active = projects[activeIdx] ?? projects[0];
    if (!active) return null;

    const hasLive = active.liveUrl && active.liveUrl !== '#';
    const hasGit = active.githubUrl && active.githubUrl !== '#';
    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <div className="hidden lg:grid grid-cols-12 gap-12">
            {/* Pinned details */}
            <div className="col-span-5">
                <div className="sticky top-24 flex h-[calc(100svh-8rem)] flex-col justify-between py-4">
                    <div>
                        <div className="flex items-baseline gap-2 font-mono text-sm text-muted-foreground">
                            <span className="font-headline text-6xl font-semibold tabular-nums text-foreground">{pad(activeIdx + 1)}</span>
                            <span>/ {pad(projects.length)}</span>
                        </div>

                        {/* Re-keyed so the details animate in each time the active project changes */}
                        <div key={active.id} className="mt-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
                            <h3 className="font-headline text-4xl font-semibold tracking-tight text-foreground xl:text-5xl">{active.title}</h3>
                            <p className="mt-5 line-clamp-5 leading-relaxed text-muted-foreground">{active.description}</p>
                            <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/80">
                                {active.tags.slice(0, 6).join(' · ')}
                            </p>
                            {active.githubStats && (
                                <div className="mt-4 flex items-center gap-5 font-mono text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5" />{active.githubStats.stargazers_count}</span>
                                    <span className="flex items-center gap-1.5"><GitFork className="h-3.5 w-3.5" />{active.githubStats.forks_count}</span>
                                    {active.githubStats.language && <span>{active.githubStats.language}</span>}
                                </div>
                            )}
                            <div className="mt-8 flex items-center gap-3">
                                {active.slug && (
                                    <Link href={`/projects/${active.slug}`} data-magnetic className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
                                        Case study <ArrowRight className="h-4 w-4" />
                                    </Link>
                                )}
                                {hasLive && (
                                    <a href={active.liveUrl!} target="_blank" rel="noopener noreferrer" data-magnetic className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
                                        Visit site <ArrowUpRight className="h-4 w-4" />
                                    </a>
                                )}
                                {hasGit && (
                                    <a href={active.githubUrl!} target="_blank" rel="noopener noreferrer" data-magnetic className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/5">
                                        Source <ArrowUpRight className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pager: dots on a rule; the active one gets a ring and the rule fills up to it */}
                    <nav aria-label="Projects" className="relative pb-2 pt-8">
                        <span aria-hidden="true" className="absolute left-1.5 right-1.5 top-[calc(2rem+5px)] h-px bg-border" />
                        <span
                            aria-hidden="true"
                            className="absolute left-1.5 top-[calc(2rem+5px)] h-px bg-foreground transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{ width: projects.length > 1 ? `calc((100% - 0.75rem) * ${activeIdx / (projects.length - 1)})` : 0 }}
                        />
                        <ol className="relative flex justify-between">
                            {projects.map((p, i) => {
                                const isActive = i === activeIdx;
                                const isPast = i < activeIdx;
                                return (
                                    <li key={p.id} className="group relative flex">
                                        <button
                                            type="button"
                                            onClick={() => slides.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                                            aria-label={`${pad(i + 1)} ${p.title}`}
                                            aria-current={isActive ? 'step' : undefined}
                                            className="relative flex h-3 w-3 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                                        >
                                            {/* Ring around the active dot */}
                                            <span
                                                className={`absolute inset-0 rounded-full border border-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? 'scale-[2.2]' : 'scale-0'}`}
                                            />
                                            <span
                                                className={`h-2 w-2 rounded-full transition-colors duration-500 ${isActive || isPast ? 'bg-foreground' : 'bg-border group-hover:bg-muted-foreground'}`}
                                            />
                                        </button>
                                        {/* Tooltip */}
                                        <span
                                            role="presentation"
                                            className={`pointer-events-none absolute bottom-full mb-4 translate-y-1 ${i === 0 ? '-left-1' : i === projects.length - 1 ? '-right-1' : 'left-1/2 -translate-x-1/2'} whitespace-nowrap rounded-full bg-foreground px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-background opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100`}
                                        >
                                            {pad(i + 1)} · {p.title}
                                        </span>
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Scrolling previews */}
            <div className="col-span-7 flex flex-col gap-24 py-[10svh]">
                {projects.map((p, i) => (
                    <div
                        key={p.id}
                        ref={(el) => { slides.current[i] = el; }}
                        data-index={i}
                        data-reveal="unclip"
                        data-cursor="View"
                        onClick={() => onOpen(p)}
                        className={`group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-opacity duration-500 ${i === activeIdx ? 'opacity-100' : 'opacity-40'}`}
                    >
                        {p.imageUrl ? (
                            <Image
                                src={p.imageUrl}
                                alt={p.title}
                                fill
                                sizes="(min-width: 1024px) 58vw, 100vw"
                                className="object-cover scroll-zoom grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                                unoptimized={p.imageUrl.startsWith('http')}
                            />
                        ) : (
                            <ProjectPlaceholder title={p.title} tags={p.tags} className="p-10 [&>p:last-child]:text-6xl xl:[&>p:last-child]:text-7xl" />
                        )}
                        {/* Caption only over screenshots; the title tile already shows the name */}
                        {p.imageUrl && (
                            <div className="absolute bottom-4 left-4 rounded-full bg-background/80 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-foreground backdrop-blur">
                                {pad(i + 1)} — {p.title}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
