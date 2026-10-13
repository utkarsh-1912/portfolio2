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
