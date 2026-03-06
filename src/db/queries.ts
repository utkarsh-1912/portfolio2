import { db } from './index';
import { hero, about, projects, education, skills, blogs, contacts } from './schema';
import { asc, desc, eq } from 'drizzle-orm';

export async function getHero() {
    const data = await db.select().from(hero).limit(1);
    return data[0];
}

export async function getAbout() {
    const data = await db.select().from(about).limit(1);
    return data[0];
}

export async function getProjects() {
    return db.select().from(projects).orderBy(asc(projects.sequence), desc(projects.createdAt));
}

export async function getEducation() {
    return db.select().from(education);
}

export async function getSkills() {
    return db.select().from(skills);
}

export async function getBlogs() {
    return db.select().from(blogs).orderBy(asc(blogs.sequence), asc(blogs.id));
}

export async function getContacts() {
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
}
