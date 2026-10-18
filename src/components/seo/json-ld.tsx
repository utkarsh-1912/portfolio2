import { SITE_URL } from '@/lib/site';

/**
 * Renders schema.org structured data so search engines can show richer results.
 * `<` is escaped so content can't close the script tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
    );
}

type Hero = {
    title?: string | null;
    description?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    youtubeUrl?: string | null;
    photoUrl?: string | null;
} | null;

export function personSchema(hero: Hero) {
    const sameAs = [hero?.githubUrl, hero?.linkedinUrl, hero?.twitterUrl, hero?.youtubeUrl].filter((u) => u && u !== '#');
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: hero?.title || 'Utkarsh Gupta',
        url: SITE_URL,
        jobTitle: 'Software Engineer',
        description: hero?.description ?? undefined,
        image: hero?.photoUrl || `${SITE_URL}/profile.jpg`,
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology (ISM), Dhanbad' },
        sameAs,
    };
}

export function projectSchema(p: { title: string; description: string; slug: string | null; tags: string[]; githubUrl?: string | null; liveUrl?: string | null }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: p.title,
        description: p.description,
        url: `${SITE_URL}/projects/${p.slug}`,
        codeRepository: p.githubUrl && p.githubUrl !== '#' ? p.githubUrl : undefined,
        programmingLanguage: p.tags,
        author: { '@id': `${SITE_URL}/#person` },
    };
}

export function articleSchema(a: { title: string; description: string; slug: string | null; publishedAt?: string | null; imageUrl?: string | null }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: a.title,
        description: a.description,
        url: `${SITE_URL}/blog/${a.slug}`,
        datePublished: a.publishedAt ?? undefined,
        image: a.imageUrl || undefined,
        author: { '@id': `${SITE_URL}/#person` },
    };
}
