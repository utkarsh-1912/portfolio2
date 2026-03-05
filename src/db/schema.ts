import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";

export const hero = pgTable('hero', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    roles: jsonb('roles').$type<string[]>().notNull(),
    description: text('description').notNull(),
    githubUrl: text('github_url'),
    linkedinUrl: text('linkedin_url'),
    twitterUrl: text('twitter_url'),
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
});

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    tags: jsonb('tags').$type<string[]>().notNull(),
    imageUrl: text('image_url'), // Instead of imageUrlId, we just store full image URL from imgbb
    liveUrl: text('live_url'),
    githubUrl: text('github_url'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const education = pgTable('education', {
    id: serial('id').primaryKey(),
    degree: text('degree').notNull(),
    institution: text('institution').notNull(),
    duration: text('duration').notNull(),
    description: text('description').notNull(),
    icon: text('icon').notNull(),
});

export const blogs = pgTable('blogs', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    url: text('url').notNull(),
    imageUrl: text('image_url'),
    imageHint: text('image_hint'),
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
