import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getBlogBySlug } from '@/db/queries';
import { isAdmin } from '@/lib/auth-server';
import { resolveImage } from '@/lib/images';
import { Markdown } from '@/components/ui/markdown';
import { RevealObserver } from '@/components/ui/reveal-observer';
import { SplitText } from '@/components/ui/split-text';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ preview?: string }>;
};

async function load(slug: string, preview?: string) {
    const includeDrafts = preview === '1' && (await isAdmin());
    return { post: await getBlogBySlug(slug, { includeDrafts }), includeDrafts };
}

function readingTime(markdown: string) {
    return Math.max(1, Math.round(markdown.split(/\s+/).length / 220));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { post } = await load((await params).slug, (await searchParams).preview);
    if (!post) return { title: 'Article not found' };
    return {
        title: post.title,
        description: post.description.slice(0, 160),
        alternates: { canonical: `/blog/${post.slug}` },
        openGraph: { type: 'article', title: post.title, description: post.description.slice(0, 160), url: `/blog/${post.slug}`, publishedTime: post.publishedAt ?? undefined },
    };
}

export default async function ArticlePage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { post, includeDrafts } = await load(slug, (await searchParams).preview);
    if (!post) notFound();
    // Articles without an on-site body live elsewhere
    if (!post.content) redirect(post.url);

    const img = resolveImage(post.imageUrl, post.imageHint);
    const date = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
        : null;
    const meta = [date, `${readingTime(post.content)} min read`, ...(post.tags ?? []).slice(0, 3)].filter(Boolean).join(' · ');

    return (
        <article className="pb-24">
            {includeDrafts && post.status !== 'active' && (
                <div className="sticky top-20 z-40 mx-auto mt-2 w-fit rounded-full bg-foreground px-4 py-1.5 text-xs text-background">
                    Preview · this article is a {post.status} and hidden from visitors
                </div>
            )}

            <header className="container max-w-4xl pt-12 md:pt-20">
                <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> All writing
                </Link>
                <p data-reveal="up" className="eyebrow mt-10">{meta}</p>
                <SplitText as="h1" text={post.title} className="mt-5 block font-headline text-4xl font-semibold leading-[1] tracking-tight sm:text-6xl" />
                <p data-reveal="up" style={{ '--i': 2 } as React.CSSProperties} className="mt-8 text-xl leading-relaxed text-muted-foreground">
                    {post.description}
                </p>
            </header>

            {img && (
                <div className="container mt-14 max-w-5xl">
                    <div data-reveal="unclip" className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-muted">
                        <Image src={img} alt="" fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" unoptimized={img.startsWith('http')} />
                    </div>
                </div>
            )}

            <div className="container mt-16 max-w-3xl">
                <Markdown>{post.content}</Markdown>
                <div className="mt-20 border-t border-border pt-8">
                    <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        <span className="link-draw">Back to all writing</span>
                    </Link>
                </div>
            </div>

            <RevealObserver />
        </article>
    );
}
