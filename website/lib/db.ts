import { neon } from '@neondatabase/serverless';

// Neon serverless PostgreSQL connection
// Set DATABASE_URL in .env.local with your Neon connection string
const sql = neon(process.env.DATABASE_URL!);

export default sql;
