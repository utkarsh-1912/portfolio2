'use server';

import * as z from 'zod';
import { db } from '../../db';
import { hero, about, projects, education, blogs, skills, certifications, testimonials, pages } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CONTENT_TAG } from '../../db/queries';
import { requireAdmin } from '@/lib/auth-server';
import { formatDuration } from '@/lib/timeline';
import { slugify } from '@/lib/slug';
import {
    type ActionResult,
    aboutInput,
    blogInput,
    certificationInput,
    pageInput,
    testimonialInput,
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
        // Clear cached content queries, then re-render every page that uses them
        revalidateTag(CONTENT_TAG);
        revalidatePath('/', 'layout');
        return { ok: true, data };
    } catch (e) {
        if (e instanceof z.ZodError) return { ok: false, error: formatZodError(e) };
        if (e instanceof Error && e.message === 'Unauthorized') {
            return { ok: false, error: 'Your session expired. Please log in again.' };
        }
        // Postgres unique violation (Drizzle may wrap it in `cause`)
        const code = (e as { code?: string; cause?: { code?: string } })?.code ?? (e as { cause?: { code?: string } })?.cause?.code;
        if (code === '23505') {
            return { ok: false, error: 'That URL name is already used by another item. Pick a different one.' };
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
/** Fills in the URL name from the title when it's left empty. */
function withSlug<T extends { title: string; slug: string | null }>(row: T): T & { slug: string } {
    return { ...row, slug: row.slug || slugify(row.title) };
}

export async function addProjectAction(data: unknown) {
    return adminAction(async () => {
        await db.insert(projects).values(withSlug(projectInput.parse(data)));
    });
}

export async function updateProjectAction(id: number, data: unknown) {
    return adminAction(async () => {
        await db.update(projects).set(withSlug(projectInput.parse(data))).where(eq(projects.id, idInput.parse(id)));
    });
}

export async function reorderProjectsAction(orderedIds: number[]) {
    return adminAction(async () => {
        const ids = z.array(idInput).max(500).parse(orderedIds);
        await Promise.all(ids.map((id, index) => db.update(projects).set({ sequence: index }).where(eq(projects.id, id))));
    });
}

/**
 * Prefills a new project from a public GitHub repo: name, description (repo "About" or the
 * README's first paragraph), topics + main language as tags, homepage as the live URL.
 */
export async function importFromGitHubAction(repoUrl: string) {
    return adminAction(async () => {
        const match = z.string().parse(repoUrl).match(/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#]|$)/i);
        if (!match) throw new z.ZodError([{ code: 'custom', path: ['githubUrl'], message: 'Paste a github.com/<owner>/<repo> link' }]);
        const [, owner, repo] = match;
        const headers: HeadersInit = {
            Accept: 'application/vnd.github+json',
            ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        };

        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers, cache: 'no-store' });
        if (!res.ok) {
            throw new z.ZodError([{ code: 'custom', path: ['githubUrl'], message: res.status === 404 ? 'Repo not found (is it private?)' : `GitHub returned ${res.status}${res.status === 403 ? ' (rate limit; set GITHUB_TOKEN)' : ''}` }]);
        }
        const info = await res.json();

        let description: string = info.description || '';
        if (!description) {
            const readme = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers: { ...headers, Accept: 'application/vnd.github.raw+json' }, cache: 'no-store' });
            if (readme.ok) {
                // First real paragraph: skip headings, badges, HTML and blank lines
                const para = (await readme.text())
                    .split(/\n\s*\n/)
                    .map((p) => p.replace(/<[^>]+>/g, '').trim())
                    .find((p) => p && !p.startsWith('#') && !p.startsWith('![') && !p.startsWith('[!') && p.length > 40);
                description = para?.replace(/\s+/g, ' ').slice(0, 600) ?? '';
            }
        }

        const tags = [...(info.topics ?? []), info.language].filter(Boolean).slice(0, 8);
        return {
            title: String(info.name).replace(/[-_]+/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            description,
            tags,
            githubUrl: info.html_url as string,
            liveUrl: (info.homepage as string) || '',
        };
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
        await db.insert(blogs).values(withSlug(blogInput.parse(data)));
    });
}

export async function updateBlogAction(id: number, data: unknown) {
    return adminAction(async () => {
        await db.update(blogs).set(withSlug(blogInput.parse(data))).where(eq(blogs.id, idInput.parse(id)));
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

export async function reorderCertificationsAction(orderedIds: number[]) {
    return adminAction(async () => {
        const ids = z.array(idInput).max(500).parse(orderedIds);
        await Promise.all(ids.map((id, index) => db.update(certifications).set({ sequence: index }).where(eq(certifications.id, id))));
    });
}

// -- Testimonial Actions --
export async function addTestimonialAction(data: unknown) {
    return adminAction(async () => {
        await db.insert(testimonials).values(testimonialInput.parse(data));
    });
}

export async function updateTestimonialAction(id: number, data: unknown) {
    return adminAction(async () => {
        await db.update(testimonials).set(testimonialInput.parse(data)).where(eq(testimonials.id, idInput.parse(id)));
    });
}

export async function deleteTestimonialAction(id: number) {
    return adminAction(async () => {
        await db.delete(testimonials).where(eq(testimonials.id, idInput.parse(id)));
    });
}

export async function reorderTestimonialsAction(orderedIds: number[]) {
    return adminAction(async () => {
        const ids = z.array(idInput).max(500).parse(orderedIds);
        await Promise.all(ids.map((id, index) => db.update(testimonials).set({ sequence: index }).where(eq(testimonials.id, id))));
    });
}

// -- Page Actions (/now, /uses) --
export async function updatePageAction(id: number, data: unknown) {
    return adminAction(async () => {
        await db.update(pages).set({ ...pageInput.parse(data), updatedAt: new Date() }).where(eq(pages.id, idInput.parse(id)));
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
