'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ExternalLink, Github, Search, ArrowUpRight, Tag } from 'lucide-react';
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

export function ProjectsPageClient({ projects }: { projects: Project[] }) {
    const [selected, setSelected] = useState<ProjectModalData | null>(null);
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // Collect all unique tags
    const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

    const filtered = projects.filter(p => {
        const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
        const matchTag = !activeTag || p.tags.includes(activeTag);
        return matchSearch && matchTag;
    });

    return (
        <div id="projects" className="container py-16 sm:py-24">
            {/* Header */}
            <div className="text-center mb-10">
                <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 bg-primary/10 px-4 py-1.5 rounded-full">Portfolio</span>
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">All Projects</h1>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
                    Every project I've built — click any card to explore details.
                </p>
            </div>

            {/* Search + tag filter */}
            <div className="mb-8 flex flex-col gap-3">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search projects…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveTag(null)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${!activeTag ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary'}`}
                    >
                        All
                    </button>
                    {allTags.slice(0, 5).map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${activeTag === tag ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-6">{filtered.length} project{filtered.length !== 1 ? 's' : ''} {activeTag ? `tagged "${activeTag}"` : ''}</p>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project) => {
                    const imgUrl = resolveImageUrl(project.imageUrl);
                    const hasLive = project.liveUrl && project.liveUrl !== '#';
                    const hasGit = project.githubUrl && project.githubUrl !== '#';

                    return (
                        <div
                            key={project.id}
                            onClick={() => setSelected(project)}
                            className="group flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Image / fallback */}
                            {imgUrl ? (
                                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                                    <Image
                                        src={imgUrl}
                                        alt={project.title}
                                        fill
                                        unoptimized={imgUrl.startsWith('http')}
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-background/80 backdrop-blur-sm rounded-full p-1.5 border border-border/50">
                                            <ArrowUpRight className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-[16/7] bg-gradient-to-br from-primary/20 via-primary/5 to-muted/30 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-primary/20 font-headline">{project.title[0]}</span>
                                </div>
                            )}

                            {/* Body */}
                            <div className="flex-1 flex flex-col p-5">
                                <h3 className="font-bold font-headline text-base mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{project.description}</p>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {project.tags.slice(0, 4).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs bg-primary/8 text-primary border-primary/15">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {project.tags.length > 4 && <Badge variant="outline" className="text-xs text-muted-foreground">+{project.tags.length - 4}</Badge>}
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-border/40" onClick={e => e.stopPropagation()}>
                                    {hasGit && (
                                        <a href={project.githubUrl!} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted">
                                            <Github className="h-3.5 w-3.5" /> GitHub
                                        </a>
                                    )}
                                    {hasLive && (
                                        <a href={project.liveUrl!} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-primary/10">
                                            <ExternalLink className="h-3.5 w-3.5" /> Live
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <Tag className="h-8 w-8 mx-auto mb-3 opacity-40" />
                    <p>No projects match your filter.</p>
                </div>
            )}

            <ProjectModal project={selected} onClose={() => setSelected(null)} />
        </div>
    );
}
