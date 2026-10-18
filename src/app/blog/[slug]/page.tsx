import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getBlogBySlug, getBlogs } from '@/db/queries';
import { extractToc } from '@/lib/toc';
import { ReadingProgress } from '@/components/ui/reading-progress';
import { isAdmin } from '@/lib/auth-server';
import { resolveImage, skipOptimization } from '@/lib/images';
import { Markdown } from '@/components/ui/markdown';
import { RevealObserver } from '@/components/ui/reveal-observer';
import { SplitText } from '@/components/ui/split-text';
import { JsonLd, articleSchema } from '@/components/seo/json-ld';

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
    const toc = extractToc(post.content);
    // Neighbours among articles hosted on this site, in the same order as the /blog page
    const onSite = (await getBlogs()).filter((b) => b.content && b.slug);
    const at = onSite.findIndex((b) => b.id === post.id);
    const prev = at > 0 ? onSite[at - 1] : null;
    const next = at >= 0 && at < onSite.length - 1 ? onSite[at + 1] : null;
    const date = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
        : null;
    const meta = [date, `${readingTime(post.content)} min read`, ...(post.tags ?? []).slice(0, 3)].filter(Boolean).join(' · ');

    return (
        <article className="pb-24">
            <JsonLd data={articleSchema(post)} />
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
                        <Image src={img} alt="" fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" unoptimized={skipOptimization(img)} />
                    </div>
                </div>
            )}

            <ReadingProgress targetId="article-body" />

            <div className="container mt-16 grid max-w-6xl gap-12 lg:grid-cols-[1fr_220px]">
                <div id="article-body" className="min-w-0 max-w-3xl">
                    <Markdown>{post.content}</Markdown>
                </div>

                {/* Table of contents for longer articles */}
                {toc.length >= 3 && (
                    <nav aria-label="On this page" className="hidden lg:block">
                        <div className="sticky top-28">
                            <p className="eyebrow">On this page</p>
                            <ol className="mt-4 space-y-2 border-l border-border text-sm">
                                {toc.map((item) => (
                                    <li key={item.id} className={item.level === 3 ? 'pl-7' : 'pl-4'}>
                                        <a href={`#${item.id}`} className="-ml-px block border-l border-transparent pl-0 text-muted-foreground transition-colors hover:text-foreground">
                                            {item.text}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </nav>
                )}
            </div>

            {/* Previous / next on-site article */}
            <nav aria-label="More articles" className="container mt-24 max-w-6xl">
                <div className="grid gap-6 border-t border-border pt-10 sm:grid-cols-2">
                    {prev ? (
                        <Link href={`/blog/${prev.slug}`} className="group block">
                            <span className="eyebrow inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Previous</span>
                            <span className="mt-2 block font-headline text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">{prev.title}</span>
                        </Link>
                    ) : (
                        <Link href="/blog" className="group block">
                            <span className="eyebrow inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Back</span>
                            <span className="mt-2 block font-headline text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">All writing</span>
                        </Link>
                    )}
                    {next && (
                        <Link href={`/blog/${next.slug}`} className="group block sm:text-right">
                            <span className="eyebrow inline-flex items-center gap-1">Next <ArrowRight className="h-3 w-3" /></span>
                            <span className="mt-2 block font-headline text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">{next.title}</span>
                        </Link>
                    )}
                </div>
            </nav>

            <RevealObserver />
        </article>
    );
}
