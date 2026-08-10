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
            <div className="relative bg-card w-full max-w-2xl rounded-none shadow-2xl tech-border overflow-hidden animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] flex flex-col font-mono">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-none bg-background/80 backdrop-blur-sm tech-border text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
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
                    <h2 className="text-xl font-bold text-primary pr-8 mb-4 uppercase tracking-wider">&gt; {project.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6 font-sans">{project.description}</p>

                    {/* Tags */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            <Tag className="h-3 w-3" /> Tech Stack
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary rounded-none">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Action links */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-primary/20">
                        {hasLive && (
                            <a
                                href={project.liveUrl!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-2 sm:px-5 py-2.5 rounded-none tech-border bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
                            >
                                <ExternalLink className="h-4 w-4" /> ./execute
                            </a>
                        )}
                        {hasGit && (
                            <a
                                href={project.githubUrl!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-2 sm:px-5 py-2.5 rounded-none tech-border bg-background text-foreground font-bold text-xs uppercase tracking-widest hover:bg-muted transition-colors"
                            >
                                <Github className="h-4 w-4" /> git clone
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
