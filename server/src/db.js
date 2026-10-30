/**
 * PostgreSQL connection and database setup.
 * Tables are created automatically on first start (no data is erased).
 * For a real production app, replace CREATE TABLE IF NOT EXISTS with migrations.
 */
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(process.env.PGSSLMODE === 'require' ? { ssl: { rejectUnauthorized: true } } : {}),
});

// DATABASE SCHEMA: users own credentials and role; todos persist after restart.
export async function initializeDatabase() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing. Copy server/.env.example to server/.env.');
  await db.query("CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY, username VARCHAR(30) UNIQUE NOT NULL, password_hash TEXT NOT NULL, role VARCHAR(10) NOT NULL DEFAULT 'editor' CHECK (role IN ('reader', 'writer', 'editor', 'admin')), created_at TIMESTAMPTZ NOT NULL DEFAULT now())");
  await db.query("CREATE TABLE IF NOT EXISTS todos (id UUID PRIMARY KEY, text VARCHAR(160) NOT NULL, assignee VARCHAR(80) NOT NULL DEFAULT '', difficulty SMALLINT NOT NULL DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5), complete BOOLEAN NOT NULL DEFAULT FALSE, created_by UUID REFERENCES users(id) ON DELETE SET NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())");
  await db.query('CREATE INDEX IF NOT EXISTS todos_created_at_idx ON todos (created_at DESC)');

  // ADMIN SEED: only server environment variables can create an admin.
  const username = process.env.ADMIN_USERNAME?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (username && password) {
    if (password.length < 8) throw new Error('ADMIN_PASSWORD must have at least 8 characters.');
    const { rows } = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (!rows.length) {
      const { randomUUID } = await import('node:crypto');
      const hash = await bcrypt.hash(password, 12);
      await db.query('INSERT INTO users (id, username, password_hash, role) VALUES ($1, $2, $3, $4)', [randomUUID(), username, hash, 'admin']);
      console.log('Admin account initialized.');
    }
  }
}
