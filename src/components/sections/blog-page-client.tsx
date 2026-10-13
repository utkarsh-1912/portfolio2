'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { RevealObserver } from '@/components/ui/reveal-observer';
import { PostCard, type PostCardData } from './post-card';

export function BlogPageClient({ posts }: { posts: PostCardData[] }) {
    const [search, setSearch] = useState('');

    const q = search.trim().toLowerCase();
    const filtered = posts.filter(
        (p) => !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
    const [featured, ...rest] = filtered;

    return (
        <div className="container py-16 md:py-24">
            <SectionHeading
                as="h1"
                label="Writing"
                title="Notes & articles"
                intro="Thoughts on web development, engineering and technology."
            />

            <label className="relative mb-14 block w-full md:w-72">
                <span className="sr-only">Search articles</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="search"
                    placeholder="Search articles"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-11 w-full rounded-full border border-border bg-transparent pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/50"
                />
            </label>

            {featured && (
                <div data-reveal="up" className="mb-24 border-b border-border pb-24">
                    <PostCard post={featured} split />
                </div>
            )}

            {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post, i) => (
                        <div key={post.id} data-reveal="up" style={{ '--i': i % 3 } as React.CSSProperties}>
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            )}

            {filtered.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border py-24 text-center text-muted-foreground">
                    No articles match your search.
                </div>
            )}

            <RevealObserver />
        </div>
    );
}
