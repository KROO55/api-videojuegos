import pg from 'pg';
import { readFile } from 'node:fs/promises';
if (!process.env.DATABASE_URL) throw new Error('Configura DATABASE_URL en .env');
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5, connectionTimeoutMillis: 5000, query_timeout: 5000 });
pool.on('error', () => console.error('Conexion inactiva de PostgreSQL interrumpida'));
export async function initialize() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(await readFile(new URL('../sql/init.sql', import.meta.url), 'utf8'));
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
