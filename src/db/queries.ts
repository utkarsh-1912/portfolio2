import { db } from './index';
import { hero, about, projects, education, skills, blogs, contacts } from './schema';
import { asc, desc, eq } from 'drizzle-orm';

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

export async function getProjects() {
    try {
        return await db.select().from(projects).orderBy(asc(projects.sequence), desc(projects.createdAt));
    } catch (e) {
        console.error('getProjects error:', e);
        return [];
    }
}

export async function getEducation() {
    try {
        return await db.select().from(education);
    } catch (e) {
        console.error('getEducation error:', e);
        return [];
    }
}

export async function getSkills() {
    try {
        return await db.select().from(skills).orderBy(asc(skills.category));
    } catch (e) {
        console.error('getSkills error:', e);
        return [];
    }
}

export async function getBlogs() {
    try {
        return await db.select().from(blogs).orderBy(asc(blogs.sequence));
    } catch (e) {
        console.error('getBlogs error:', e);
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
