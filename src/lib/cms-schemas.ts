import * as z from 'zod';
import { CONTENT_STATUSES } from '@/db/schema';

// Validation for every admin write. Parsing also strips unknown keys, so a client
// can't sneak `id`, `createdAt` or other columns into an insert/update.

const optionalUrl = z
    .string()
    .trim()
    .max(2048)
    .refine((v) => v === '' || v === '#' || /^https?:\/\//i.test(v), 'Must be an http(s) URL')
    .nullish()
    .transform((v) => v || null);

// Image fields take a hosted URL or a bundled placeholder id (e.g. "project-book-manager")
const optionalImage = z
    .string()
    .trim()
    .max(2048)
    .refine((v) => v === '' || /^https?:\/\//i.test(v) || /^[a-z0-9-]+$/i.test(v), 'Must be an http(s) URL or placeholder id')
    .nullish()
    .transform((v) => v || null);

// Existing rows can hold NULL in array columns, and comma-split inputs leave blanks; drop both
const stringList = (maxItem: number, maxLen: number) =>
    z
        .array(z.string().trim().max(maxLen))
        .max(maxItem)
        .nullish()
        .transform((v) => (v ?? []).filter(Boolean));

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const heroInput = z.object({
    title: z.string().trim().min(1).max(120),
    roles: stringList(20, 80),
    description: z.string().trim().min(1).max(2000),
    githubUrl: optionalUrl,
    linkedinUrl: optionalUrl,
    twitterUrl: optionalUrl,
    youtubeUrl: optionalUrl,
    // Only hosted images; never store base64 data URLs in the database
    photoUrl: optionalUrl,
});

export const aboutInput = z.array(z.string().max(5000)).max(20);

export const projectInput = z.object({
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().min(1).max(5000),
    tags: stringList(30, 40),
    imageUrl: optionalImage,
    liveUrl: optionalUrl,
    githubUrl: optionalUrl,
    sequence: z.coerce.number().int().min(-1000).max(1000).catch(0),
    status: z.enum(CONTENT_STATUSES).nullish().transform((v) => v ?? 'active'),
    featured: z.boolean().nullish().transform((v) => !!v),
});

export const educationInput = z
    .object({
        degree: z.string().trim().min(1).max(200),
        institution: z.string().trim().min(1).max(200),
        description: z.string().trim().min(1).max(3000),
        icon: z.enum(['Briefcase', 'GraduationCap']),
        startDate: isoDate,
        endDate: isoDate.nullish().transform((v) => v || null),
        sequence: z.coerce.number().int().min(-1000).max(1000).catch(0),
    })
    .refine((v) => !v.endDate || v.endDate >= v.startDate, {
        message: 'End date must be after the start date',
        path: ['endDate'],
    });

export const blogInput = z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(3000),
    url: z.string().trim().url().max(2048),
    imageUrl: optionalImage,
    imageHint: z.string().trim().max(200).nullish().transform((v) => v || null),
    tags: stringList(20, 40),
    publishedAt: isoDate.nullish().or(z.literal('')).transform((v) => v || null),
    sequence: z.coerce.number().int().min(-1000).max(1000).catch(0),
    status: z.enum(CONTENT_STATUSES).nullish().transform((v) => v ?? 'active'),
});

export const certificationInput = z
    .object({
        title: z.string().trim().min(1).max(200),
        issuer: z.string().trim().min(1).max(120),
        issueDate: isoDate.nullish().or(z.literal('')).transform((v) => v || null),
        expiryDate: isoDate.nullish().or(z.literal('')).transform((v) => v || null),
        credentialId: z.string().trim().max(200).nullish().transform((v) => v || null),
        credentialUrl: optionalUrl,
        imageUrl: optionalUrl,
        skills: stringList(20, 40),
        sequence: z.coerce.number().int().min(-1000).max(1000).catch(0),
        status: z.enum(CONTENT_STATUSES).nullish().transform((v) => v ?? 'active'),
    })
    .refine((v) => !v.issueDate || !v.expiryDate || v.expiryDate >= v.issueDate, {
        message: 'Expiry must be after the issue date',
        path: ['expiryDate'],
    });

export const skillCategoryInput = z.object({
    category: z.string().trim().min(1).max(80),
    categoryIcon: z.string().trim().min(1).max(60),
    items: z
        .array(z.object({ name: z.string().trim().max(60), icon: z.string().trim().min(1).max(60) }))
        .max(100)
        // Skip rows left blank in the editor
        .transform((items) => items.filter((i) => i.name !== '')),
});

export const idInput = z.number().int().positive();

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

/** Turns a zod error into a short, human-readable message for a toast. */
export function formatZodError(error: z.ZodError): string {
    return error.issues.map((i) => `${i.path.join('.') || 'input'}: ${i.message}`).join('; ');
}
