import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env.local') });

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
    console.error('DATABASE_URL or POSTGRES_URL is not defined in .env.local');
    process.exit(1);
}

const sql = neon(databaseUrl);

async function cleanup() {
    console.log('🧹 Starting database cleanup...');
    try {
        console.log('Deleting likes...');
        await sql`DELETE FROM likes`;

        console.log('Deleting comments...');
        await sql`DELETE FROM comments`;

        console.log('Deleting posts...');
        await sql`DELETE FROM posts`;

        console.log('Deleting rate limits...');
        await sql`DELETE FROM rate_limits`;

        console.log('✅ Database cleanup complete!');
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
    }
}

cleanup();
