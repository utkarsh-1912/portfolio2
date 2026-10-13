import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { RollText } from '@/components/ui/roll-text';
import { resolveImage } from '@/lib/images';
import { cn } from '@/lib/utils';

export type PostCardData = {
    id: number;
    title: string;
    description: string;
    url: string;
    imageUrl?: string | null;
    imageHint?: string | null;
    tags?: string[] | null;
    publishedAt?: string | null;
};

function formatDate(value?: string | null) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Article card linking out to the post. `featured` uses a larger title;
 * `compact` uses a wide, short image for stacking beside a featured card;
 * `split` lays a featured post out full width, image left and text right.
 */
export function PostCard({ post, featured = false, compact = false, split = false, className }: { post: PostCardData; featured?: boolean; compact?: boolean; split?: boolean; className?: string }) {
    const img = resolveImage(post.imageUrl, post.imageHint);
    const date = formatDate(post.publishedAt);
    const meta = [date, ...(post.tags ?? []).slice(0, 2)].filter(Boolean).join(' · ');

    if (split) {
        return (
            <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Read"
                className={cn('group grid items-center gap-8 lg:grid-cols-12 lg:gap-14', className)}
            >
                <div data-spotlight className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border bg-muted lg:col-span-7">
                    {img ? (
                        <Image
                            src={img}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 58vw, 100vw"
                            unoptimized={img.startsWith('http')}
                            className="object-cover grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                        />
                    ) : (
                        <span className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent" />
                    )}
                </div>
                <div className="lg:col-span-5">
                    <p className="eyebrow flex items-center gap-3">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">Featured</span>
                        {meta}
                    </p>
                    <h2 className="mt-5 font-headline text-3xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary md:text-5xl">
                        {post.title}
                    </h2>
                    <p className="mt-5 line-clamp-5 text-base leading-relaxed text-muted-foreground md:text-lg">{post.description}</p>
                    <span className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background">
                        <RollText>Read article</RollText>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                </div>
            </a>
        );
    }

    return (
        <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Read"
            className={cn('group flex flex-col', className)}
        >
            <div data-spotlight className={cn('relative w-full overflow-hidden rounded-2xl border border-border bg-muted', featured ? 'aspect-[16/10]' : compact ? 'aspect-[16/8]' : 'aspect-[4/3]')}>
                {img ? (
                    <Image
                        src={img}
                        alt=""
                        fill
                        sizes={featured ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 30vw, 100vw'}
                        unoptimized={img.startsWith('http')}
                        className="object-cover grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                ) : (
                    <span className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent" />
                )}
            </div>
            <div className="mt-5">
                {meta && <p className="eyebrow">{meta}</p>}
                <h3 className={cn('mt-2 font-headline font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary', featured ? 'text-2xl md:text-3xl' : 'text-xl')}>
                    {post.title}
                    <ArrowUpRight className="ml-1 inline h-5 w-5 align-[-2px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
            </div>
        </a>
    );
}
