import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getTestimonials } from '@/db/queries';
import { SectionHeading } from '@/components/ui/section-heading';
import { hasLink, skipOptimization } from '@/lib/images';

/** Recommendations from people you've worked with. Hidden until at least one is published. */
export async function TestimonialsSection() {
    const items = await getTestimonials();
    if (items.length === 0) return null;

    const [lead, ...rest] = items;

    return (
        <section id="testimonials" className="relative w-full border-t border-border py-24 md:py-36">
            <div className="container">
                {/* Unnumbered so the other sections keep their numbers while this one is empty and hidden */}
                <SectionHeading label="Kind words" title="What people say" />

                {/* The first quote set large, the rest in a grid */}
                <figure data-reveal="up" className="max-w-5xl">
                    <blockquote className="font-headline text-2xl font-medium leading-snug tracking-tight md:text-4xl">
                        <span aria-hidden="true" className="mr-1 text-primary">&ldquo;</span>
                        {lead.quote}
                        <span aria-hidden="true" className="text-primary">&rdquo;</span>
                    </blockquote>
                    <Attribution item={lead} className="mt-8" />
                </figure>

                {rest.length > 0 && (
                    <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {rest.map((t, i) => (
                            <figure
                                key={t.id}
                                data-reveal="up"
                                data-spotlight
                                style={{ '--i': i % 3 } as React.CSSProperties}
                                className="lift flex flex-col justify-between gap-8 rounded-3xl border border-border bg-card p-7"
                            >
                                <blockquote className="leading-relaxed text-foreground/85">&ldquo;{t.quote}&rdquo;</blockquote>
                                <Attribution item={t} />
                            </figure>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

type Item = Awaited<ReturnType<typeof getTestimonials>>[number];

function Attribution({ item, className }: { item: Item; className?: string }) {
    const meta = [item.role, item.company].filter(Boolean).join(', ');
    return (
        <figcaption className={`flex items-center gap-3 ${className ?? ''}`}>
            {item.avatarUrl ? (
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                    <Image src={item.avatarUrl} alt="" fill sizes="40px" className="object-cover" unoptimized={skipOptimization(item.avatarUrl)} />
                </span>
            ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-headline font-semibold" aria-hidden="true">
                    {item.name[0]}
                </span>
            )}
            <span className="min-w-0">
                <span className="block font-medium">{item.name}</span>
                {meta && <span className="block text-sm text-muted-foreground">{meta}</span>}
            </span>
            {hasLink(item.linkUrl) && (
                <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground" aria-label={`Source of ${item.name}'s recommendation`}>
                    Source <ArrowUpRight className="h-3 w-3" />
                </a>
            )}
        </figcaption>
    );
}
