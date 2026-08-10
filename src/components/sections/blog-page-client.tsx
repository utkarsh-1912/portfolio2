'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, BookOpen, Search } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Blog = {
    id: number;
    title: string;
    description: string;
    url: string;
    imageUrl?: string | null;
    imageHint?: string | null;
    sequence?: number | null;
};

export function BlogPageClient({ posts }: { posts: Blog[] }) {
    const [search, setSearch] = useState('');

    function resolveImage(imageUrl?: string | null, imageHint?: string | null) {
        if (imageUrl) return imageUrl;
        if (imageHint) {
            const imgObj = PlaceHolderImages.find((p) => p.imageHint === imageHint);
            if (imgObj) return imgObj.imageUrl;
        }
        return '';
    }

    const filtered = posts.filter(p => {
        return !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    });

    const featured = filtered.length > 0 ? filtered[0] : null;
    const rest = filtered.length > 1 ? filtered.slice(1) : [];

    return (
        <div id="blog" className="container py-8 sm:py-16 lg:py-24 font-mono animate-in fade-in duration-700">
            {/* Page header */}
            <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 bg-primary/10 px-4 py-1.5 border border-primary/30 rounded-none">./writing</span>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">&gt; ls -la ./blog_archive</h1>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground font-sans md:text-lg">
                    Thoughts on web development, engineering, and technology.
                </p>
            </div>

            {/* Search */}
            <div className="mb-12 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                <div className="relative w-full max-w-md mx-auto">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold">&gt;</span>
                    <input
                        type="text"
                        placeholder="grep -i 'article'..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 rounded-none tech-border bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-primary placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-40" />
                    <p>No articles match your filter.</p>
                </div>
            )}

            {/* Featured (first post) — wide card */}
            {featured && (() => {
                const imgUrl = resolveImage(featured.imageUrl, featured.imageHint);
                return (
                    <Link
                        href={featured.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col md:flex-row rounded-none tech-border bg-card overflow-hidden transition-all duration-300 mb-8 animate-in fade-in zoom-in-95 duration-700"
                        style={{ animationDelay: '200ms', animationFillMode: 'both' }}
                    >
                        {imgUrl && (
                            <div className="relative md:w-2/5 aspect-[16/9] md:aspect-auto shrink-0 overflow-hidden bg-muted border-r border-primary/20">
                                <Image
                                    src={imgUrl}
                                    alt={featured.title}
                                    fill
                                    unoptimized={imgUrl.startsWith('http')}
                                    className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card hidden md:block" />
                            </div>
                        )}
                        <div className="flex-1 flex flex-col p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge className="bg-primary text-primary-foreground text-xs uppercase tracking-widest rounded-none">Featured</Badge>
                                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1"><BookOpen className="h-3 w-3" /> Article</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-primary transition-colors">{featured.title}</h2>
                            <p className="text-muted-foreground leading-relaxed flex-1 mb-6 font-sans">{featured.description}</p>
                            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                                <ExternalLink className="h-4 w-4" /> execute ./read
                            </div>
                        </div>
                    </Link>
                );
            })()}

            {/* Remaining posts — grid */}
            {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((post, idx) => {
                        const imgUrl = resolveImage(post.imageUrl, post.imageHint);
                        return (
                            <Link
                                key={post.id}
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col rounded-none tech-border bg-card overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${(idx + 3) * 100}ms`, animationFillMode: 'both' }}
                            >
                                {imgUrl ? (
                                    <div className="relative aspect-[16/9] overflow-hidden bg-muted border-b border-primary/20">
                                        <Image
                                            src={imgUrl}
                                            alt={post.title}
                                            fill
                                            unoptimized={imgUrl.startsWith('http')}
                                            className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-[16/8] bg-gradient-to-br from-primary/15 via-primary/5 to-muted/30 flex items-center justify-center border-b border-primary/20">
                                        <BookOpen className="h-8 w-8 text-primary/30" />
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col p-5">
                                    <h3 className="font-bold text-base mb-2 text-primary transition-colors line-clamp-2">{post.title}</h3>
                                    <p className="text-muted-foreground font-sans text-sm leading-relaxed flex-1 line-clamp-3 mb-4">{post.description}</p>
                                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors mt-auto pt-4 border-t border-primary/20">
                                        <ExternalLink className="h-3 w-3" /> execute ./read
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
