import { pgTable, text, serial, integer, timestamp, jsonb, boolean, date } from "drizzle-orm/pg-core";

// Content visibility shared by projects and blogs. Only 'active' rows are shown on the public site.
export const CONTENT_STATUSES = ['active', 'draft', 'archived'] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const hero = pgTable('hero', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    roles: jsonb('roles').$type<string[]>().notNull(),
    description: text('description').notNull(),
    githubUrl: text('github_url'),
    linkedinUrl: text('linkedin_url'),
    twitterUrl: text('twitter_url'),
    youtubeUrl: text('youtube_url'),
    photoUrl: text('photo_url'),
});

export const about = pgTable('about', {
    id: serial('id').primaryKey(),
    paragraphs: jsonb('paragraphs').$type<string[]>().notNull(),
});

export const skills = pgTable('skills', {
    id: serial('id').primaryKey(),
    category: text('category').notNull(),
    categoryIcon: text('category_icon').notNull(),
    items: jsonb('items').$type<{ name: string, icon: string }[]>().notNull(),
    sequence: integer('sequence').default(0),
});

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    tags: jsonb('tags').$type<string[]>().notNull(),
    imageUrl: text('image_url'), // Instead of imageUrlId, we just store full image URL from imgbb
    liveUrl: text('live_url'),
    githubUrl: text('github_url'),
    sequence: integer('sequence').default(0),
    status: text('status').$type<ContentStatus>().default('active'),
    featured: boolean('featured').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

export const education = pgTable('education', {
    id: serial('id').primaryKey(),
    degree: text('degree').notNull(),
    institution: text('institution').notNull(),
    // Display label, e.g. "Jul 2024 - Present". Generated from the dates by the admin form.
    duration: text('duration').notNull(),
    description: text('description').notNull(),
    icon: text('icon').notNull(),
    // Used for ordering the timeline (newest first). A null endDate means "Present".
    startDate: date('start_date'),
    endDate: date('end_date'),
    // Manual override: lower values are shown first; ties fall back to date order.
    sequence: integer('sequence').default(0),
});

export const certifications = pgTable('certifications', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    issuer: text('issuer').notNull(),
    // ISO dates ("YYYY-MM-DD"); a null expiry means the credential doesn't expire
    issueDate: date('issue_date'),
    expiryDate: date('expiry_date'),
    credentialId: text('credential_id'),
    credentialUrl: text('credential_url'),
    // Badge image (hosted URL)
    imageUrl: text('image_url'),
    skills: jsonb('skills').$type<string[]>().default([]),
    sequence: integer('sequence').default(0),
    status: text('status').$type<ContentStatus>().default('active'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const blogs = pgTable('blogs', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    url: text('url').notNull(),
    imageUrl: text('image_url'),
    imageHint: text('image_hint'),
    tags: jsonb('tags').$type<string[]>().default([]),
    publishedAt: text('published_at'),
    sequence: integer('sequence').default(0),
    status: text('status').$type<ContentStatus>().default('active'),
});

export const contacts = pgTable('contacts', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    status: text('status').default('unread'),
    adminReply: text('admin_reply'),
});
