// Run: npm run db:migrate
// Idempotent and additive only: safe to run more than once, never drops data.
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { parseDuration } from '../lib/timeline';
import { slugify } from '../lib/slug';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
    console.log('Applying schema v2...');

    // Columns that already exist in some databases but were missing from schema.ts
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS sequence integer DEFAULT 0`;
    await sql`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS published_at text`;
    await sql`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS sequence integer DEFAULT 0`;
    console.log('✓ projects/blogs columns in sync');

    // New: draft/archive support for blogs
    await sql`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'`;
    await sql`UPDATE blogs SET status = 'active' WHERE status IS NULL`;
    await sql`UPDATE projects SET status = 'active' WHERE status IS NULL`;
    console.log('✓ blogs.status added');

    // New: real dates + manual order for the timeline
    await sql`ALTER TABLE education ADD COLUMN IF NOT EXISTS start_date date`;
    await sql`ALTER TABLE education ADD COLUMN IF NOT EXISTS end_date date`;
    await sql`ALTER TABLE education ADD COLUMN IF NOT EXISTS sequence integer DEFAULT 0`;
    console.log('✓ education.start_date / end_date / sequence added');

    // Backfill dates from the free-text duration, only where not set yet
    const rows = (await sql`SELECT id, duration FROM education WHERE start_date IS NULL`) as { id: number; duration: string }[];
    for (const row of rows) {
        const { startDate, endDate } = parseDuration(row.duration);
        if (!startDate) {
            console.warn(`  ! could not parse duration for education #${row.id}: "${row.duration}" (set it in the admin)`);
            continue;
        }
        await sql`UPDATE education SET start_date = ${startDate}, end_date = ${endDate} WHERE id = ${row.id}`;
        console.log(`  #${row.id} "${row.duration}" -> ${startDate} .. ${endDate ?? 'present'}`);
    }

    // New: certifications
    await sql`CREATE TABLE IF NOT EXISTS certifications (
        id serial PRIMARY KEY,
        title text NOT NULL,
        issuer text NOT NULL,
        issue_date date,
        expiry_date date,
        credential_id text,
        credential_url text,
        image_url text,
        skills jsonb DEFAULT '[]'::jsonb,
        sequence integer DEFAULT 0,
        status text DEFAULT 'active',
        created_at timestamp DEFAULT now()
    )`;
    console.log('✓ certifications table ready');

    // New: resume link, project case studies, on-site articles
    await sql`ALTER TABLE hero ADD COLUMN IF NOT EXISTS resume_url text`;
    for (const col of ['problem', 'approach', 'architecture', 'results']) {
        await sql.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS ${col} text`);
    }
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug text`;
    await sql`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS slug text`;
    await sql`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content text`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_unique ON projects (slug)`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS blogs_slug_unique ON blogs (slug)`;
    console.log('✓ resume_url, project case-study fields, article slug/content added');

    // Backfill slugs from titles, de-duplicating with the row id when two titles collide
    for (const table of ['projects', 'blogs'] as const) {
        const rows = (await sql.query(`SELECT id, title FROM ${table} WHERE slug IS NULL ORDER BY id`)) as { id: number; title: string }[];
        const taken = new Set(((await sql.query(`SELECT slug FROM ${table} WHERE slug IS NOT NULL`)) as { slug: string }[]).map((r) => r.slug));
        for (const row of rows) {
            let slug = slugify(row.title) || `${table}-${row.id}`;
            if (taken.has(slug)) slug = `${slug}-${row.id}`;
            taken.add(slug);
            await sql.query(`UPDATE ${table} SET slug = $1 WHERE id = $2`, [slug, row.id]);
            console.log(`  ${table} #${row.id} -> ${slug}`);
        }
    }

    console.log('Done!');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
