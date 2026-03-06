'use client';

import { useEffect, useRef } from 'react';
import { X, ExternalLink, Github, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function resolveImageUrl(imageUrl?: string | null): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
    const imgObj = PlaceHolderImages.find((p) => p.id === imageUrl);
    return imgObj?.imageUrl ?? '';
}

export type ProjectModalData = {
    id: number;
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string | null;
    liveUrl?: string | null;
    githubUrl?: string | null;
};

interface ProjectModalProps {
    project: ProjectModalData | null;
    onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        if (!project) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [project, onClose]);

    if (!project) return null;

    const hasLive = project.liveUrl && project.liveUrl !== '#';
    const hasGit = project.githubUrl && project.githubUrl !== '#';

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div className="relative bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border/60 overflow-hidden animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] flex flex-col">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-background transition-all"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Project image */}
                {(() => {
                    const imgSrc = resolveImageUrl(project.imageUrl);
                    return imgSrc ? (
                        <div className="relative w-full aspect-[16/8] shrink-0 overflow-hidden bg-muted">
                            <Image
                                src={imgSrc}
                                alt={project.title}
                                fill
                                className="object-cover"
                                unoptimized={imgSrc.startsWith('http')}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                        </div>
                    ) : null;
                })()}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h2 className="text-2xl font-bold font-headline mb-3 text-foreground pr-8">{project.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{project.description}</p>

                    {/* Tags */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                            <Tag className="h-3 w-3" /> Tech Stack
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Action links */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-border/40">
                        {hasLive && (
                            <a
                                href={project.liveUrl!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                            >
                                <ExternalLink className="h-4 w-4" /> Live Demo
                            </a>
                        )}
                        {hasGit && (
                            <a
                                href={project.githubUrl!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background text-foreground font-semibold text-sm hover:bg-muted transition-colors"
                            >
                                <Github className="h-4 w-4" /> Source Code
                            </a>
                        )}
                        {!hasLive && !hasGit && (
                            <span className="text-sm text-muted-foreground italic">No links available.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
