import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// We ensure the connection string is read differently if we're generating static pages?
// Actually we can just use process.env.DATABASE_URL
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
