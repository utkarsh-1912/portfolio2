'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Github, ArrowUpRight } from 'lucide-react';
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
        <section id="projects" className="w-full py-20 lg:py-28 bg-muted/30">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 bg-primary/10 px-4 py-1.5 rounded-full">Portfolio</span>
                    <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">My Projects</h2>
                    <p className="mt-4 max-w-xl mx-auto text-muted-foreground">A selection of things I've built — click any card to explore details.</p>
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
                                className="group relative flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Image */}
                                {imgUrl ? (
                                    <div className="relative overflow-hidden aspect-[16/9]">
                                        <Image
                                            src={imgUrl}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            unoptimized={imgUrl.startsWith('http')}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        {/* Hover expand icon */}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-background/80 backdrop-blur-sm rounded-full p-1.5 border border-border/50">
                                                <ArrowUpRight className="h-4 w-4 text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Fallback no-image gradient header */
                                    <div className="aspect-[16/7] bg-gradient-to-br from-primary/20 via-primary/5 to-muted/30 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-primary/20 font-headline">{project.title[0]}</span>
                                    </div>
                                )}

                                {/* Body */}
                                <div className="flex-1 flex flex-col p-5">
                                    <h3 className="font-bold font-headline text-lg mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{project.description}</p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {project.tags.slice(0, 4).map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/8 text-primary border-primary/15 hover:bg-primary/15">
                                                {tag}
                                            </Badge>
                                        ))}
                                        {project.tags.length > 4 && (
                                            <Badge variant="outline" className="text-xs text-muted-foreground">+{project.tags.length - 4}</Badge>
                                        )}
                                    </div>

                                    {/* Footer links — stop propagation so clicks don't re-open modal */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-border/40" onClick={e => e.stopPropagation()}>
                                        {hasGit && (
                                            <a href={project.githubUrl!} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
                                            >
                                                <Github className="h-3.5 w-3.5" /> GitHub
                                            </a>
                                        )}
                                        {hasLive && (
                                            <a href={project.liveUrl!} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:border-primary">
                        <Link href="/projects">
                            View All Projects <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Modal */}
            <ProjectModal project={selected} onClose={() => setSelected(null)} />
        </section>
    );
}
