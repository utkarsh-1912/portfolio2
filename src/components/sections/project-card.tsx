'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';
import { resolveImage, hasLink } from '@/lib/images';
import { ProjectPlaceholder } from './project-placeholder';

export type ProjectCardData = {
    id: number;
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string | null;
    liveUrl?: string | null;
    githubUrl?: string | null;
    slug?: string | null;
    githubStats?: { stargazers_count: number; forks_count: number; language?: string | null } | null;
};

/** Image-led project card used on the home page (mobile) and the /projects archive. */
export function ProjectCard({ project, index, onOpen }: { project: ProjectCardData; index: number; onOpen: () => void }) {
    const img = resolveImage(project.imageUrl);

    return (
        <article className="group flex h-full flex-col">
            <button
                type="button"
                onClick={onOpen}
                data-cursor="View"
                data-spotlight
                aria-label={`Open details for ${project.title}`}
                className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted"
            >
                {img ? (
                    <Image
                        src={img}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        unoptimized={img.startsWith('http')}
                        className="object-cover grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                ) : (
                    <ProjectPlaceholder title={project.title} tags={project.tags} className="pt-14" />
                )}
                <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground backdrop-blur">
                    {String(index + 1).padStart(2, '0')}
                </span>
            </button>

            <div className="mt-5 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-headline text-xl font-semibold tracking-tight text-foreground">{project.title}</h3>
                    {project.githubStats && (
                        <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground" title="GitHub stars">
                            <Star className="h-3 w-3" /> {project.githubStats.stargazers_count}
                        </span>
                    )}
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/80">
                    {project.tags.slice(0, 4).join(' · ')}
                </p>
                <div className="mt-auto flex gap-5 pt-5 text-sm">
                    {project.slug && (
                        <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors">
                            <span className="link-draw">Case study</span>
                        </Link>
                    )}
                    {hasLink(project.liveUrl) && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors">
                            <span className="link-draw">Visit site</span> <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                    )}
                    {hasLink(project.githubUrl) && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                            <span className="link-draw">Source</span> <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
