import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { db } from './index';
import { hero, about, projects, education, skills, blogs, contacts, certifications } from './schema';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { sortTimeline } from '@/lib/timeline';

// Public pages only see 'active' rows; the admin passes includeDrafts to see everything.
type ListOptions = { includeDrafts?: boolean };

/** Cache tag for all portfolio content; admin saves call revalidateTag(CONTENT_TAG). */
export const CONTENT_TAG = 'content';

/**
 * Wraps a content query so it hits the database at most once per request (React `cache`)
 * and is reused across requests until an admin save invalidates the tag. Failures are not
 * cached: the error propagates to `safe`, which logs it and returns a fallback for this
 * request only, so a database blip can't leave the site empty for an hour.
 * Note: results pass through JSON, so timestamp columns arrive as ISO strings.
 */
function cachedQuery<A extends unknown[], R>(name: string, fn: (...args: A) => Promise<R>, fallback: R) {
    const shared = unstable_cache(fn, [name], { tags: [CONTENT_TAG], revalidate: 3600 });
    return cache(async (...args: A): Promise<R> => {
        try {
            return await shared(...args);
        } catch (e) {
            console.error(`${name} error:`, e);
            return fallback;
        }
    });
}

export const getHero = cachedQuery(
    'getHero',
    async () => (await db.select().from(hero).limit(1))[0] ?? null,
    null
);

export const getAbout = cachedQuery(
    'getAbout',
    async () => (await db.select().from(about).limit(1))[0] ?? null,
    null
);

const projectsQuery = cachedQuery(
    'getProjects',
    async (includeDrafts: boolean) => {
        let query = db.select().from(projects).$dynamic();
        if (!includeDrafts) query = query.where(eq(projects.status, 'active'));
        return query.orderBy(desc(projects.featured), asc(projects.sequence), desc(projects.createdAt));
    },
    []
);
export const getProjects = ({ includeDrafts = false }: ListOptions = {}) => projectsQuery(includeDrafts);

const projectBySlugQuery = cachedQuery(
    'getProjectBySlug',
    async (slug: string, includeDrafts: boolean) => {
        const where = includeDrafts ? eq(projects.slug, slug) : and(eq(projects.slug, slug), eq(projects.status, 'active'));
        return (await db.select().from(projects).where(where).limit(1))[0] ?? null;
    },
    null
);
/** One project by slug; drafts only when `includeDrafts` (admin preview). */
export const getProjectBySlug = (slug: string, { includeDrafts = false }: ListOptions = {}) => projectBySlugQuery(slug, includeDrafts);

// Sorted in JS so rows without dates yet still order correctly from their duration text
export const getEducation = cachedQuery('getEducation', async () => sortTimeline(await db.select().from(education)), []);

export const getSkills = cachedQuery(
    'getSkills',
    async () => db.select().from(skills).orderBy(asc(skills.sequence), asc(skills.category)),
    []
);

const blogsQuery = cachedQuery(
    'getBlogs',
    async (includeDrafts: boolean) => {
        let query = db.select().from(blogs).$dynamic();
        if (!includeDrafts) query = query.where(eq(blogs.status, 'active'));
        return query.orderBy(asc(blogs.sequence), desc(blogs.id));
    },
    []
);
export const getBlogs = ({ includeDrafts = false }: ListOptions = {}) => blogsQuery(includeDrafts);

const blogBySlugQuery = cachedQuery(
    'getBlogBySlug',
    async (slug: string, includeDrafts: boolean) => {
        const where = includeDrafts ? eq(blogs.slug, slug) : and(eq(blogs.slug, slug), eq(blogs.status, 'active'));
        return (await db.select().from(blogs).where(where).limit(1))[0] ?? null;
    },
    null
);
/** One article by slug; drafts only when `includeDrafts` (admin preview). */
export const getBlogBySlug = (slug: string, { includeDrafts = false }: ListOptions = {}) => blogBySlugQuery(slug, includeDrafts);

const certificationsQuery = cachedQuery(
    'getCertifications',
    async (includeDrafts: boolean) => {
        let query = db.select().from(certifications).$dynamic();
        if (!includeDrafts) query = query.where(eq(certifications.status, 'active'));
        // Manual order first, then newest issue date
        return query.orderBy(asc(certifications.sequence), sql`${certifications.issueDate} desc nulls last`, desc(certifications.id));
    },
    []
);
export const getCertifications = ({ includeDrafts = false }: ListOptions = {}) => certificationsQuery(includeDrafts);

/** The inbox is never cached: new messages must show up immediately. */
export async function getContacts() {
    try {
        return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
    } catch (e) {
        console.error('getContacts error:', e);
        return [];
    }
}
