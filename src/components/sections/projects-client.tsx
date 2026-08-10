'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Github, ArrowUpRight, Star, GitFork } from 'lucide-react';
import { ProjectModal, type ProjectModalData } from '@/components/ui/project-modal';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Project = {
    id: number;
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string | null;
    liveUrl?: string | null;
    githubUrl?: string | null;
    githubStats?: any | null;
};

function resolveImageUrl(imageUrl?: string | null): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    const imgObj = PlaceHolderImages.find((p) => p.id === imageUrl);
    return imgObj?.imageUrl ?? '';
}

export function ProjectsSectionClient({ projects }: { projects: Project[] }) {
    const [selected, setSelected] = useState<ProjectModalData | null>(null);
    const latestProjects = projects.slice(0, 6);

    return (
        <section id="projects" className="w-full min-h-screen py-10 md:py-16 lg:py-28 bg-background relative border-t border-border/50 snap-start flex flex-col justify-center overflow-y-auto">
            {/* Subtle grid background overlay */}
            <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>
            
            <div className="container relative z-10">
                {/* Header */}
                <div className="text-center md:text-left mb-14 font-mono">
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 bg-primary/10 px-4 py-1 border border-primary/30 rounded-none">./projects</span>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                        &gt; ls -la my_work
                    </h2>
                    <p className="mt-4 max-w-xl text-muted-foreground font-sans">A selection of things I've built. Execute [click] on any card to initialize details.</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {latestProjects.map((project, idx) => {
                        const imgUrl = resolveImageUrl(project.imageUrl);
                        const hasLive = project.liveUrl && project.liveUrl !== '#';
                        const hasGit = project.githubUrl && project.githubUrl !== '#';

                        return (
                            <div
                                key={project.id}
                                onClick={() => setSelected(project)}
                                className="group relative flex flex-col rounded-none tech-border bg-card overflow-hidden cursor-pointer transition-all duration-300"
                            >

                                {/* Image */}
                                {imgUrl ? (
                                    <div className="relative overflow-hidden aspect-[16/9] border-b border-primary/20">
                                        <Image
                                            src={imgUrl}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                            unoptimized={imgUrl.startsWith('http')}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        {/* Hover expand icon */}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-background/90 rounded p-1.5 border border-primary/50">
                                                <ArrowUpRight className="h-4 w-4 text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Fallback no-image gradient header */
                                    <div className="aspect-[16/9] bg-muted/20 border-b border-primary/20 flex items-center justify-center font-mono">
                                        <span className="text-xl font-bold text-primary/40">No preview available</span>
                                    </div>
                                )}

                                {/* Body */}
                                <div className="flex-1 flex flex-col p-5 font-mono">
                                    <h3 className="font-bold text-lg mb-2 text-primary">{project.title}</h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed mb-4 flex-1 line-clamp-3 font-sans">{project.description}</p>
                                    
                                    {/* GitHub Stats */}
                                    {project.githubStats && (
                                        <div className="flex items-center gap-4 mt-auto mb-4 text-xs font-mono text-muted-foreground">
                                            <div className="flex items-center gap-1.5" title="Stars">
                                                <Star className="h-3.5 w-3.5 text-yellow-500" />
                                                <span>{project.githubStats.stargazers_count}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="Forks">
                                                <GitFork className="h-3.5 w-3.5 text-primary" />
                                                <span>{project.githubStats.forks_count}</span>
                                            </div>
                                            {project.githubStats.language && (
                                                <div className="flex items-center gap-1.5 ml-auto" title="Primary Language">
                                                    <div className="h-2 w-2 rounded-full bg-blue-500/80 ring-2 ring-blue-500/20"></div>
                                                    <span>{project.githubStats.language}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {project.tags.slice(0, 4).map((tag) => (
                                            <Badge key={tag} variant="outline" className="rounded-none border-primary/20 bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-wider">
                                                {tag}
                                            </Badge>
                                        ))}
                                        {project.tags.length > 4 && (
                                            <Badge variant="outline" className="rounded-none border-primary/20 bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-wider">
                                                +{project.tags.length - 4}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Footer links — stop propagation so clicks don't re-open modal */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-primary/20" onClick={e => e.stopPropagation()}>
                                        {hasGit && (
                                            <a href={project.githubUrl!} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors px-2 py-1 uppercase"
                                            >
                                                <Github className="h-3.5 w-3.5" /> git clone
                                            </a>
                                        )}
                                        {hasLive && (
                                            <a href={project.liveUrl!} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors px-2 py-1 uppercase"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" /> execute
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="mt-12 flex justify-center">
                    <Button asChild variant="outline" size="lg" className="rounded-none tech-border font-mono uppercase tracking-wider text-primary hover:bg-primary/10">
                        <Link href="/projects">
                            ./view_all_projects.sh <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Modal */}
            <ProjectModal project={selected} onClose={() => setSelected(null)} />
        </section>
    );
}
