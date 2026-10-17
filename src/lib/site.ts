// Canonical site URL used for metadata, the sitemap and robots.txt
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://utkristi.com').replace(/\/$/, '');

type ArticleLike = { slug?: string | null; content?: string | null; hasBody?: boolean; url: string };

/** Where an article lives: on this site when it has a Markdown body, otherwise its external URL. */
export function articleHref(post: ArticleLike) {
    return (post.hasBody || post.content) && post.slug ? `/blog/${post.slug}` : post.url;
}

/** Drops the (possibly large) Markdown body from list data, keeping a flag for linking. */
export function toArticleSummary<T extends { content?: string | null }>(post: T): Omit<T, 'content'> & { hasBody: boolean } {
    const { content, ...rest } = post;
    return { ...rest, hasBody: !!content };
}
