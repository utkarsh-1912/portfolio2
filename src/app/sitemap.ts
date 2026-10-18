import type { MetadataRoute } from 'next';
import { getAllPages, getBlogs, getProjects } from '@/db/queries';
import { SITE_URL } from '@/lib/site';
import { hasCaseStudy } from '@/lib/projects';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [projects, blogs, sitePages] = await Promise.all([getProjects(), getBlogs(), getAllPages()]);
    const now = new Date();

    return [
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
        { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        ...sitePages
            .filter((p) => p.status === 'active')
            .map((p) => ({ url: `${SITE_URL}/${p.slug}`, lastModified: p.updatedAt ? new Date(p.updatedAt) : now, changeFrequency: 'monthly' as const, priority: 0.5 })),
        ...projects
            .filter((p) => p.slug && hasCaseStudy(p))
            .map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, lastModified: p.createdAt ?? now, changeFrequency: 'monthly' as const, priority: 0.7 })),
        // Only articles hosted here; external posts belong to their own sites
        ...blogs
            .filter((b) => b.slug && b.content)
            .map((b) => ({ url: `${SITE_URL}/blog/${b.slug}`, lastModified: b.publishedAt ? new Date(b.publishedAt) : now, changeFrequency: 'yearly' as const, priority: 0.6 })),
    ];
}
