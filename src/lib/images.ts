import { PlaceHolderImages } from './placeholder-images';

/**
 * Resolves a stored image value to a usable src: hosted URLs and absolute paths pass through,
 * placeholder ids (e.g. "project-book-manager") and image hints map to the bundled placeholders.
 */
export function resolveImage(imageUrl?: string | null, imageHint?: string | null): string {
    if (imageUrl) {
        if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
        const byId = PlaceHolderImages.find((p) => p.id === imageUrl);
        if (byId) return byId.imageUrl;
    }
    if (imageHint) {
        const byHint = PlaceHolderImages.find((p) => p.imageHint === imageHint);
        if (byHint) return byHint.imageUrl;
    }
    return '';
}

/** Treats empty strings and the "#" placeholder as "no link". */
export function hasLink(url?: string | null): url is string {
    return !!url && url !== '#';
}

// Hosts allowed in next.config.ts `images.remotePatterns`; keep the two lists in sync
const OPTIMIZED_HOSTS = ['i.ibb.co', 'images.unsplash.com', 'picsum.photos', 'placehold.co'];

/**
 * Whether next/image should skip optimisation for this src. Local files and allowed hosts
 * get resized, modern-format images; anything else is served as-is (Next would reject it).
 */
export function skipOptimization(src: string | { src: string } | null | undefined): boolean {
    if (!src || typeof src !== 'string') return false;
    if (src.startsWith('/')) return false;
    try {
        return !OPTIMIZED_HOSTS.includes(new URL(src).hostname);
    } catch {
        return true;
    }
}
