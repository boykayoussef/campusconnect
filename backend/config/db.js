import pg from 'pg';
import 'dotenv/config';
const { Pool } = pg;

if (!process.env.DATABASE_URL) console.warn('DATABASE_URL is not set. Configure the Supabase Postgres connection string before starting the API.');
export const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 5 });
export async function connectDB(){ const c=await pool.connect(); try { await c.query('select 1'); console.log('Supabase PostgreSQL connected'); } finally { c.release(); } }
