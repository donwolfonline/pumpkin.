import { neon } from '@neondatabase/serverless';

// Neon serverless PostgreSQL connection
// Set DATABASE_URL in .env.local with your Neon connection string
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
    console.warn('DATABASE_URL or POSTGRES_URL is not defined');
}

const sql = neon(databaseUrl || '');

export default sql;
