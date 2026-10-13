'use server';

import * as z from 'zod';
import { db } from '../../db';
import { hero, about, projects, education, blogs, skills, certifications } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-server';
import { formatDuration } from '@/lib/timeline';
import {
    type ActionResult,
    aboutInput,
    blogInput,
    certificationInput,
    educationInput,
    formatZodError,
    heroInput,
    idInput,
    projectInput,
    skillCategoryInput,
} from '@/lib/cms-schemas';

/**
 * Wraps every admin action: checks the session, validates input and turns failures
 * into `{ ok: false, error }` so forms can show a toast instead of crashing.
 */
async function adminAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
    try {
        await requireAdmin();
        const data = await fn();
        revalidatePath('/', 'layout');
        return { ok: true, data };
    } catch (e) {
        if (e instanceof z.ZodError) return { ok: false, error: formatZodError(e) };
        if (e instanceof Error && e.message === 'Unauthorized') {
            return { ok: false, error: 'Your session expired. Please log in again.' };
        }
        console.error('Admin action failed:', e);
        return { ok: false, error: 'Something went wrong while saving.' };
    }
}

// -- Hero Actions --
export async function updateHeroAction(id: number, data: unknown) {
    return adminAction(async () => {
        await db.update(hero).set(heroInput.parse(data)).where(eq(hero.id, idInput.parse(id)));
    });
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function uploadImageAction(base64Data: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        await requireAdmin();
    } catch {
        return { success: false, error: 'Unauthorized' };
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) return { success: false, error: 'IMGBB_API_KEY not configured.' };

    // Strip the data:image/...;base64, prefix
    if (base64Data.includes(',') && !/^data:image\//.test(base64Data)) {
        return { success: false, error: 'Only image files can be uploaded.' };
    }
    const base64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    if (base64.length * 0.75 > MAX_UPLOAD_BYTES) {
        return { success: false, error: 'Image must be 5 MB or smaller.' };
    }

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
export async function updateAboutAction(id: number, paragraphs: unknown) {
    return adminAction(async () => {
        const clean = aboutInput.parse(paragraphs).filter((p) => p.trim() !== '');
        await db.update(about).set({ paragraphs: clean }).where(eq(about.id, idInput.parse(id)));
    });
}

// -- Project Actions --
export async function addProjectAction(data: unknown) {
    return adminAction(async () => {
        await db.insert(projects).values(projectInput.parse(data));
    });
}

export async function updateProjectAction(id: number, data: unknown) {
    return adminAction(async () => {
        await db.update(projects).set(projectInput.parse(data)).where(eq(projects.id, idInput.parse(id)));
    });
}

export async function deleteProjectAction(id: number) {
    return adminAction(async () => {
        await db.delete(projects).where(eq(projects.id, idInput.parse(id)));
    });
}

// -- Education Actions --
function toEducationRow(data: unknown) {
    const parsed = educationInput.parse(data);
    // The display label is derived from the dates so the two can never disagree
    return { ...parsed, duration: formatDuration(parsed.startDate, parsed.endDate) };
}

export async function addEducationAction(data: unknown) {
    return adminAction(async () => {
        await db.insert(education).values(toEducationRow(data));
    });
}

export async function updateEducationAction(id: number, data: unknown) {
    return adminAction(async () => {
        await db.update(education).set(toEducationRow(data)).where(eq(education.id, idInput.parse(id)));
    });
}

export async function deleteEducationAction(id: number) {
    return adminAction(async () => {
        await db.delete(education).where(eq(education.id, idInput.parse(id)));
    });
}

// -- Blog Actions --
export async function addBlogAction(data: unknown) {
    return adminAction(async () => {
        await db.insert(blogs).values(blogInput.parse(data));
    });
}

export async function updateBlogAction(id: number, data: unknown) {
    return adminAction(async () => {
        await db.update(blogs).set(blogInput.parse(data)).where(eq(blogs.id, idInput.parse(id)));
    });
}

export async function deleteBlogAction(id: number) {
    return adminAction(async () => {
        await db.delete(blogs).where(eq(blogs.id, idInput.parse(id)));
    });
}

// -- Certification Actions --
export async function addCertificationAction(data: unknown) {
    return adminAction(async () => {
        await db.insert(certifications).values(certificationInput.parse(data));
    });
}

export async function updateCertificationAction(id: number, data: unknown) {
    return adminAction(async () => {
        await db.update(certifications).set(certificationInput.parse(data)).where(eq(certifications.id, idInput.parse(id)));
    });
}

export async function deleteCertificationAction(id: number) {
    return adminAction(async () => {
        await db.delete(certifications).where(eq(certifications.id, idInput.parse(id)));
    });
}

// -- Skills Actions --
export async function addSkillCategoryAction(data: unknown) {
    return adminAction(async () => {
        const result = await db.insert(skills).values(skillCategoryInput.parse(data)).returning();
        return result[0] || null;
    });
}

export async function updateSkillCategoryAction(id: number, data: unknown) {
    return adminAction(async () => {
        await db.update(skills).set(skillCategoryInput.parse(data)).where(eq(skills.id, idInput.parse(id)));
    });
}

export async function deleteSkillCategoryAction(id: number) {
    return adminAction(async () => {
        await db.delete(skills).where(eq(skills.id, idInput.parse(id)));
    });
}

export async function reorderSkillsAction(orderedIds: number[]) {
    return adminAction(async () => {
        const ids = z.array(idInput).max(200).parse(orderedIds);
        await Promise.all(ids.map((id, index) => db.update(skills).set({ sequence: index }).where(eq(skills.id, id))));
    });
}
