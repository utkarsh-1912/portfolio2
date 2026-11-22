'use client';

import { articleHref } from '@/lib/site';
import { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
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
        <div className="research-page container py-16 md:py-24">
            <div className="standard-only"><SectionHeading
                as="h1"
                label="Writing"
                title="Notes & articles"
                intro="Thoughts on web development, engineering and technology."
            />

            </div>
            <div className="exchange-only desk-heading"><span>RESEARCH WIRE / ಬರಹ</span><h1>Engineering notes</h1><p>Ideas, implementation details, and lessons from building software.</p></div>
            <label className="research-search relative mb-14 block w-full md:w-72">
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

            <div className="standard-only">
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

            </div>
            <div className="exchange-only research-register">
                <div className="exchange-panel-title"><span>ARTICLE INDEX</span><span role="status">{filtered.length} RECORDS</span></div>
                {filtered.map((post, index) => <a key={post.id} className="research-record" href={articleHref(post)}>
                    <span className="research-ref">{String(index + 1).padStart(2, '0')}</span>
                    <div><h2>{post.title}</h2><p>{post.description}</p></div>
                    <span className="research-action">Read <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></span>
                </a>)}
            </div>

            {filtered.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border py-24 text-center text-muted-foreground">
                    No articles match your search.
                </div>
            )}

            <RevealObserver />
        </div>
    );
}
