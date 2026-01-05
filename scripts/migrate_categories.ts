import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), 'website/.env.local') });

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
    console.error('DATABASE_URL or POSTGRES_URL is not defined in .env.local');
    process.exit(1);
}

const sql = neon(databaseUrl);

async function migrate() {
    console.log('🚀 Running migration: add category to posts...');
    try {
        await sql`
            ALTER TABLE posts 
            ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'General'
        `;
        console.log('✅ Migration complete!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
}

migrate();
