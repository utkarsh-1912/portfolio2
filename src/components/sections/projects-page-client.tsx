'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ExternalLink, Github, Search, ArrowUpRight, Tag, Star, GitFork } from 'lucide-react';
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
    githubStats?: {
        stargazers_count: number;
        forks_count: number;
        language: string;
    } | null;
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

    // Collect all unique tags and sort by frequency (most used first)
    const tagFrequencies = projects.reduce((acc: Record<string, number>, p) => {
        p.tags.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
    }, {});
    
    const allTags = Object.entries(tagFrequencies)
        .sort((a, b) => b[1] - a[1])
        .map(([tag]) => tag);

    const filtered = projects.filter(p => {
        const matchSearch = !search || 
            p.title.toLowerCase().includes(search.toLowerCase()) || 
            p.description.toLowerCase().includes(search.toLowerCase()) ||
            p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
            
        const matchTag = !activeTag || p.tags.includes(activeTag);
        return matchSearch && matchTag;
    });

    return (
        <div id="projects" className="container py-8 sm:py-16 lg:py-24 font-mono animate-in fade-in duration-700">
            {/* Header */}
            <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 bg-primary/10 px-4 py-1.5 border border-primary/30 rounded-none">./portfolio</span>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">&gt; ./view_projects.sh</h1>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground font-sans md:text-lg">
                    Every project I've built — click any card to explore details.
                </p>
            </div>

            {/* Search + tag filter */}
            <div className="mb-8 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                <div className="relative w-full max-w-md mx-auto">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold">&gt;</span>
                    <input
                        type="text"
                        placeholder="grep -i 'project'..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 rounded-none tech-border bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-primary placeholder:text-muted-foreground"
                    />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => setActiveTag(null)}
                        className={`px-3 py-1 rounded-none text-xs font-bold tracking-wider uppercase border transition-all ${!activeTag ? 'bg-primary/20 text-primary border-primary/50' : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary bg-background'}`}
                    >
                        [ All ]
                    </button>
                    {allTags.slice(0, 5).map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            className={`px-3 py-1 rounded-none text-xs font-bold tracking-wider uppercase border transition-all ${activeTag === tag ? 'bg-primary/20 text-primary border-primary/50' : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary bg-background'}`}
                        >
                            [ {tag} ]
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-6">{filtered.length} project{filtered.length !== 1 ? 's' : ''} {activeTag ? `tagged "${activeTag}"` : ''}</p>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project, idx) => {
                    const imgUrl = resolveImageUrl(project.imageUrl);
                    const hasLive = project.liveUrl && project.liveUrl !== '#';
                    const hasGit = project.githubUrl && project.githubUrl !== '#';

                    return (
                        <div
                            key={project.id}
                            onClick={() => setSelected(project)}
                            className="group flex flex-col rounded-none tech-border bg-card overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: `${(idx + 3) * 100}ms`, animationFillMode: 'both' }}
                        >
                            {/* Image / fallback */}
                            {imgUrl ? (
                                <div className="relative aspect-[16/9] overflow-hidden bg-muted border-b border-primary/20">
                                    <Image
                                        src={imgUrl}
                                        alt={project.title}
                                        fill
                                        unoptimized={imgUrl.startsWith('http')}
                                        className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-background/80 backdrop-blur-sm rounded-none px-2 py-1 border border-primary/50 text-[10px] text-primary uppercase tracking-widest font-bold">
                                            View
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-[16/7] bg-gradient-to-br from-primary/20 via-primary/5 to-muted/30 flex items-center justify-center border-b border-primary/20">
                                    <span className="text-4xl font-bold text-primary/20">{project.title[0]}</span>
                                </div>
                            )}

                            {/* Body */}
                            <div className="flex-1 flex flex-col p-5">
                                <h3 className="font-bold text-base mb-2 text-primary transition-colors">{project.title}</h3>
                                <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{project.description}</p>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {project.tags.slice(0, 4).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-[10px] rounded-none bg-primary/10 text-primary border-primary/20 uppercase tracking-wider">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {project.tags.length > 4 && <Badge variant="outline" className="text-[10px] rounded-none border-primary/20 text-primary">+{project.tags.length - 4}</Badge>}
                                </div>

                                {/* GitHub Stats */}
                                {project.githubStats && (
                                    <div className="flex items-center gap-4 mb-4 pt-4 border-t border-primary/20 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
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
                                                <div className="h-2 w-2 rounded-full bg-blue-500/80"></div>
                                                <span>{project.githubStats.language}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-2 pt-4 border-t border-primary/20" onClick={e => e.stopPropagation()}>
                                    {hasGit && (
                                        <a href={project.githubUrl!} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-none hover:bg-primary/10 border border-transparent hover:border-primary/20">
                                            <Github className="h-3.5 w-3.5" /> Source
                                        </a>
                                    )}
                                    {hasLive && (
                                        <a href={project.liveUrl!} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-none hover:bg-primary/10 border border-transparent hover:border-primary/20">
                                            <ExternalLink className="h-3.5 w-3.5" /> Execute
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
