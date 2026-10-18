import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPage } from '@/db/queries';
import { isAdmin } from '@/lib/auth-server';
import { Markdown } from '@/components/ui/markdown';
import { SectionHeading } from '@/components/ui/section-heading';
import { RevealObserver } from '@/components/ui/reveal-observer';

/** Loads a free-form page; drafts are visible only to a logged-in admin previewing it. */
async function load(slug: string, preview?: string) {
    const includeDrafts = preview === '1' && (await isAdmin());
    return { page: await getPage(slug, { includeDrafts }), includeDrafts };
}

export async function markdownPageMetadata(slug: string, preview?: string): Promise<Metadata> {
    const { page } = await load(slug, preview);
    if (!page) return { title: 'Not found' };
    return { title: page.title, description: page.intro ?? undefined, alternates: { canonical: `/${slug}` } };
}

/** Shared layout for /now and /uses. */
export async function MarkdownPage({ slug, preview }: { slug: string; preview?: string }) {
    const { page, includeDrafts } = await load(slug, preview);
    if (!page) notFound();

    const updated = page.updatedAt
        ? new Date(page.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
        : null;

    return (
        <div className="container max-w-4xl py-16 md:py-24">
            {includeDrafts && page.status !== 'active' && (
                <div className="mx-auto mb-8 w-fit rounded-full bg-foreground px-4 py-1.5 text-xs text-background">Preview · this page is a draft</div>
            )}
            <SectionHeading as="h1" label={updated ? `Updated ${updated}` : page.title} title={page.title} intro={page.intro ?? undefined} />
            {page.content ? (
                <div data-reveal="up">
                    <Markdown>{page.content}</Markdown>
                </div>
            ) : (
                <p className="text-muted-foreground">Nothing here yet.</p>
            )}
            <RevealObserver />
        </div>
    );
}
