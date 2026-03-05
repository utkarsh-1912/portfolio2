'use server';

import { db } from '../../db';
import { hero, about, projects, education, blogs, skills } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// -- Hero Actions --
export async function updateHeroAction(id: number, data: any) {
    await db.update(hero).set(data).where(eq(hero.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function uploadImageAction(base64Data: string): Promise<{ success: boolean; url?: string; error?: string }> {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) return { success: false, error: 'IMGBB_API_KEY not configured.' };

    // Strip the data:image/...;base64, prefix
    const base64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

    const formData = new URLSearchParams();
    formData.append('key', apiKey);
    formData.append('image', base64);

    try {
        const res = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });
        const json = await res.json();
        if (json.success) {
            return { success: true, url: json.data.url };
        }
        return { success: false, error: json.error?.message || 'Upload failed.' };
    } catch (err) {
        return { success: false, error: 'Network error during upload.' };
    }
}

// -- About Actions --
export async function updateAboutAction(id: number, paragraphs: string[]) {
    await db.update(about).set({ paragraphs }).where(eq(about.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
}

// -- Project Actions --
export async function addProjectAction(data: any) {
    await db.insert(projects).values(data);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateProjectAction(id: number, data: any) {
    await db.update(projects).set(data).where(eq(projects.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteProjectAction(id: number) {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
}

// -- Education Actions --
export async function addEducationAction(data: any) {
    await db.insert(education).values(data);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateEducationAction(id: number, data: any) {
    await db.update(education).set(data).where(eq(education.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteEducationAction(id: number) {
    await db.delete(education).where(eq(education.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
}

// -- Blog Actions --
export async function addBlogAction(data: any) {
    await db.insert(blogs).values(data);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateBlogAction(id: number, data: any) {
    await db.update(blogs).set(data).where(eq(blogs.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteBlogAction(id: number) {
    await db.delete(blogs).where(eq(blogs.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
}
