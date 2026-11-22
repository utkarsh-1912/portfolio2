'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { skipOptimization, type Slide } from '@/lib/images';

type Props = {
    slides: Slide[];
    title: string;
    /** Show a strip of thumbnails under the main image (used on case-study pages). */
    thumbnails?: boolean;
    sizes: string;
    priority?: boolean;
    className?: string;
    /** Classes for each slide's frame, e.g. an aspect ratio. */
    slideClassName?: string;
    /** Classes for the visible frame around the main image (not the thumbnails). */
    viewportClassName?: string;
};

/**
 * Swipeable image carousel for project screenshots (Embla). Arrows, dots and a counter
 * appear only when there's more than one image; ← / → work while it has focus, and those
 * key presses don't leak out to the project popup's own previous/next shortcuts.
 */
export function ProjectCarousel({ slides, title, thumbnails = false, sizes, priority = false, className, slideClassName, viewportClassName }: Props) {
    const [viewportRef, api] = useEmblaCarousel({ loop: slides.length > 1, align: 'start', duration: 28 });
    const [thumbRef, thumbApi] = useEmblaCarousel({ containScroll: 'keepSnaps', dragFree: true });
    const [index, setIndex] = useState(0);
    // Images whose optimised version failed (e.g. the optimiser timed out on a slow host); retried as originals
    const [fallback, setFallback] = useState<Set<string>>(() => new Set());
    const useOriginal = (src: string) => fallback.has(src) || skipOptimization(src);
    const onImageError = (src: string) => setFallback((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));
    const many = slides.length > 1;

    const onSelect = useCallback(() => {
        if (!api) return;
        const i = api.selectedScrollSnap();
        setIndex(i);
        thumbApi?.scrollTo(i);
    }, [api, thumbApi]);

    useEffect(() => {
        if (!api) return;
        onSelect();
        api.on('select', onSelect).on('reInit', onSelect);
        return () => {
            api.off('select', onSelect).off('reInit', onSelect);
        };
    }, [api, onSelect]);

    // A different set of images (e.g. "next project" in the popup) starts from the first one
    const slidesKey = slides.map((s) => s.src).join('|');
    useEffect(() => {
        api?.reInit();
        api?.scrollTo(0, true);
    }, [api, slidesKey]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!many) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); api?.scrollPrev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); api?.scrollNext(); }
    };

    if (slides.length === 0) return null;

    return (
        <div
            className={cn('group/carousel relative', className)}
            role="region"
            aria-roledescription="carousel"
            aria-label={`${title} screenshots`}
            tabIndex={many ? 0 : undefined}
            onKeyDown={onKeyDown}
        >
            {/* The main image and its controls; thumbnails (if any) sit below this box */}
            <div className="relative h-full">
            <div ref={viewportRef} className={cn('h-full overflow-hidden', viewportClassName)}>
                <div className="flex h-full touch-pan-y">
                    {slides.map((slide, i) => (
                        <figure
                            key={slide.src}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${i + 1} of ${slides.length}`}
                            className={cn('relative h-full min-w-0 shrink-0 grow-0 basis-full bg-muted', slideClassName)}
                        >
                            <Image
                                src={slide.src}
                                alt={slide.caption || `${title} screenshot ${i + 1}`}
                                fill
                                sizes={sizes}
                                priority={priority && i === 0}
                                unoptimized={useOriginal(slide.src)}
                                onError={() => onImageError(slide.src)}
                                className="object-cover"
                                draggable={false}
                            />
                            {slide.caption && (
                                <figcaption className={cn('absolute inset-x-3 w-fit', many && !thumbnails ? 'bottom-12' : 'bottom-3', 'max-w-[calc(100%-1.5rem)] rounded-full bg-background/85 px-3 py-1 text-xs text-foreground backdrop-blur')}>
                                    {slide.caption}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </div>
            </div>

            {many && (
                <>
                    {/* Arrows: always visible on touch, fade in on hover/focus for pointers */}
                    <button
                        type="button"
                        onClick={() => api?.scrollPrev()}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition-opacity hover:bg-background md:opacity-0 md:group-hover/carousel:opacity-100 md:group-focus-within/carousel:opacity-100"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => api?.scrollNext()}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition-opacity hover:bg-background md:opacity-0 md:group-hover/carousel:opacity-100 md:group-focus-within/carousel:opacity-100"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    <span className="absolute right-3 top-3 rounded-full bg-background/85 px-2.5 py-1 font-mono text-[10px] tabular-nums tracking-widest text-foreground backdrop-blur" aria-live="polite">
                        {index + 1} / {slides.length}
                    </span>

                    {!thumbnails && (
                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-background/70 px-2 py-1.5 backdrop-blur">
                            {slides.map((s, i) => (
                                <button
                                    key={s.src}
                                    type="button"
                                    onClick={() => api?.scrollTo(i)}
                                    aria-label={`Show image ${i + 1}`}
                                    aria-current={i === index}
                                    className={cn('h-1.5 rounded-full transition-all duration-300', i === index ? 'w-5 bg-foreground' : 'w-1.5 bg-foreground/30 hover:bg-foreground/60')}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
            </div>

            {many && thumbnails && (
                <div ref={thumbRef} className="mt-3 overflow-hidden">
                    <div className="flex gap-2">
                        {slides.map((s, i) => (
                            <button
                                key={s.src}
                                type="button"
                                onClick={() => api?.scrollTo(i)}
                                aria-label={`Show image ${i + 1}`}
                                aria-current={i === index}
                                className={cn(
                                    'relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:w-32',
                                    i === index ? 'border-foreground' : 'border-transparent opacity-60 hover:opacity-100'
                                )}
                            >
                                <Image src={s.src} alt="" fill sizes="128px" unoptimized={useOriginal(s.src)} onError={() => onImageError(s.src)} className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
