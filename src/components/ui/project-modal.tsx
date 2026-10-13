'use client';

import { useEffect, useRef } from 'react';
import { X, ArrowUpRight, ArrowLeft, ArrowRight, Star, GitFork } from 'lucide-react';
import Image from 'next/image';
import { resolveImage, hasLink } from '@/lib/images';
import { ProjectPlaceholder } from '@/components/sections/project-placeholder';

export type ProjectModalData = {
    id: number;
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string | null;
    liveUrl?: string | null;
    githubUrl?: string | null;
    githubStats?: { stargazers_count: number; forks_count: number; language?: string | null } | null;
};

interface ProjectModalProps {
    project: ProjectModalData | null;
    onClose: () => void;
    /** When given, the modal shows previous/next controls and supports ←/→ keys. */
    projects?: ProjectModalData[];
    onSelect?: (project: ProjectModalData) => void;
}

export function ProjectModal({ project, onClose, projects, onSelect }: ProjectModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);

    const index = project && projects ? projects.findIndex((p) => p.id === project.id) : -1;
    const canNavigate = !!onSelect && !!projects && projects.length > 1 && index >= 0;
    const go = (dir: 1 | -1) => {
        if (!canNavigate) return;
        onSelect!(projects![(index + dir + projects!.length) % projects!.length]);
    };

    // Lock page scroll and move focus into the dialog while open
    useEffect(() => {
        if (!project) return;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            document.body.style.overflow = '';
        };
    }, [!!project]); // eslint-disable-line react-hooks/exhaustive-deps

    // Keyboard: Escape closes, arrows move between projects
    useEffect(() => {
        if (!project) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    });

    // Start each project's details at the top
    useEffect(() => {
        bodyRef.current?.scrollTo({ top: 0 });
    }, [project?.id]);

    if (!project) return null;

    const img = resolveImage(project.imageUrl);
    const stats = project.githubStats;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[200] flex items-end justify-center bg-background/70 backdrop-blur-md animate-in fade-in duration-300 sm:items-center sm:p-6"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-modal-title"
                className="relative grid max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-3xl md:h-[min(640px,88svh)] md:overflow-hidden border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-6 duration-500 sm:rounded-3xl md:grid-cols-[1.15fr_1fr]"
            >
                {/* Visual */}
                <div key={project.id} className="relative aspect-[16/10] w-full overflow-hidden bg-muted animate-in fade-in duration-500 md:aspect-auto md:h-full">
                    {img ? (
                        <Image src={img} alt="" fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" unoptimized={img.startsWith('http')} />
                    ) : (
                        <ProjectPlaceholder title={project.title} tags={project.tags} className="p-8 sm:p-10" />
                    )}
                </div>

                {/* Details */}
                <div className="flex min-h-0 flex-col">
                    <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 sm:px-8">
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                            {canNavigate ? `${String(index + 1).padStart(2, '0')} / ${String(projects!.length).padStart(2, '0')}` : 'Project'}
                        </span>
                        <div className="flex items-center gap-1">
                            {canNavigate && (
                                <>
                                    <button onClick={() => go(-1)} aria-label="Previous project" className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted">
                                        <ArrowLeft className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => go(1)} aria-label="Next project" className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted">
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                            <button
                                ref={closeRef}
                                onClick={onClose}
                                aria-label="Close"
                                className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-foreground hover:text-background"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div ref={bodyRef} key={project.id} className="flex-1 overflow-y-auto px-6 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500 sm:px-8">
                        <h2 id="project-modal-title" className="font-headline text-3xl font-semibold tracking-tight sm:text-4xl">
                            {project.title}
                        </h2>
                        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{project.description}</p>

                        {stats && (
                            <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border text-center">
                                <div className="bg-card p-3">
                                    <dt className="eyebrow flex items-center justify-center gap-1"><Star className="h-3 w-3" /> Stars</dt>
                                    <dd className="mt-1 font-headline text-xl font-semibold tabular-nums">{stats.stargazers_count}</dd>
                                </div>
                                <div className="bg-card p-3">
                                    <dt className="eyebrow flex items-center justify-center gap-1"><GitFork className="h-3 w-3" /> Forks</dt>
                                    <dd className="mt-1 font-headline text-xl font-semibold tabular-nums">{stats.forks_count}</dd>
                                </div>
                                <div className="bg-card p-3">
                                    <dt className="eyebrow">Language</dt>
                                    <dd className="mt-1 truncate font-headline text-xl font-semibold">{stats.language || '—'}</dd>
                                </div>
                            </dl>
                        )}

                        {project.tags.length > 0 && (
                            <div className="mt-8">
                                <p className="eyebrow">Built with</p>
                                <ul className="mt-3 flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <li key={tag} className="rounded-full border border-border px-3 py-1 text-sm text-foreground/80">{tag}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {(hasLink(project.liveUrl) || hasLink(project.githubUrl)) && (
                        <div className="flex flex-wrap gap-3 border-t border-border px-6 py-5 sm:px-8">
                            {hasLink(project.liveUrl) && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-11 items-center gap-1.5 rounded-full bg-foreground px-6 text-sm font-medium text-background"
                                >
                                    Visit site <ArrowUpRight className="h-4 w-4" />
                                </a>
                            )}
                            {hasLink(project.githubUrl) && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-11 items-center gap-1.5 rounded-full border border-foreground/20 px-6 text-sm font-medium transition-colors hover:bg-foreground/5"
                                >
                                    Source code <ArrowUpRight className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
