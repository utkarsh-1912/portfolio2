// Run: npx tsx src/db/migrate-sequence.ts
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
    console.log('Adding sequence columns...');

    // Projects table
    try {
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS sequence integer DEFAULT 0`;
        console.log('✓ projects.sequence added');
    } catch (e: any) {
        console.log('projects.sequence:', e.message);
    }

    // Blogs table
    try {
        await sql`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS sequence integer DEFAULT 0`;
        console.log('✓ blogs.sequence added');
    } catch (e: any) {
        console.log('blogs.sequence:', e.message);
    }

    console.log('Done!');
}

main().catch(console.error);
