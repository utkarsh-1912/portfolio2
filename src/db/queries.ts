import { db } from './index';
import { hero, about, projects, education, skills, blogs, contacts, certifications } from './schema';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { sortTimeline } from '@/lib/timeline';

// Public pages only see 'active' rows; the admin passes includeDrafts to see everything.
type ListOptions = { includeDrafts?: boolean };

export async function getHero() {
    try {
        const data = await db.select().from(hero).limit(1);
        return data[0] || null;
    } catch (e) {
        console.error('getHero error:', e);
        return null;
    }
}

export async function getAbout() {
    try {
        const data = await db.select().from(about).limit(1);
        return data[0] || null;
    } catch (e) {
        console.error('getAbout error:', e);
        return null;
    }
}

export async function getProjects({ includeDrafts = false }: ListOptions = {}) {
    try {
        let query = db.select().from(projects).$dynamic();
        if (!includeDrafts) query = query.where(eq(projects.status, 'active'));
        return await query.orderBy(desc(projects.featured), asc(projects.sequence), desc(projects.createdAt));
    } catch (e) {
        console.error('getProjects error:', e);
        return [];
    }
}

export async function getEducation() {
    try {
        // Sorted in JS so rows without dates yet still order correctly from their duration text
        return sortTimeline(await db.select().from(education));
    } catch (e) {
        console.error('getEducation error:', e);
        return [];
    }
}

export async function getSkills() {
    try {
        return await db.select().from(skills).orderBy(asc(skills.sequence), asc(skills.category));
    } catch (e) {
        console.error('getSkills error:', e);
        return [];
    }
}

export async function getBlogs({ includeDrafts = false }: ListOptions = {}) {
    try {
        let query = db.select().from(blogs).$dynamic();
        if (!includeDrafts) query = query.where(eq(blogs.status, 'active'));
        return await query.orderBy(asc(blogs.sequence), desc(blogs.id));
    } catch (e) {
        console.error('getBlogs error:', e);
        return [];
    }
}

export async function getCertifications({ includeDrafts = false }: ListOptions = {}) {
    try {
        let query = db.select().from(certifications).$dynamic();
        if (!includeDrafts) query = query.where(eq(certifications.status, 'active'));
        // Manual order first, then newest issue date
        return await query.orderBy(asc(certifications.sequence), sql`${certifications.issueDate} desc nulls last`, desc(certifications.id));
    } catch (e) {
        console.error('getCertifications error:', e);
        return [];
    }
}

export async function getContacts() {
    try {
        return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
    } catch (e) {
        console.error('getContacts error:', e);
        return [];
    }
}
