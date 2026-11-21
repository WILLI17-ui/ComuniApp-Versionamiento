import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('Falta la variable DATABASE_URL (cadena de conexión de Supabase).');
}

const usaSsl = !/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);

// Un solo pool para toda la app. En Vercel cada función reutiliza el pool mientras esté "caliente".
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: usaSsl ? { rejectUnauthorized: false } : false,
  max: 5,
  idleTimeoutMillis: 10_000,
});

export const query = (text, params) => pool.query(text, params);
