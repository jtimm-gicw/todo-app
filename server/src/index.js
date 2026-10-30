/**
 * Phase 4: Express API server with PostgreSQL, JWT login, signup and ACL.
 *
 * Routes:
 * POST /api/signup, POST /api/signin, GET /api/me
 * GET /api/todo, POST /api/todo, PUT /api/todo/:id, DELETE /api/todo/:id
 * GET /api/users and PATCH /api/users/:id/role (admins only)
 */
import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { db, initializeDatabase } from './db.js';
import { publicUser, requireCapability, requireLogin, ROLE_CAPABILITIES } from './auth.js';
import { validateSignup, validateTask, validId } from './validation.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 random characters. See server/.env.example.');
}

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '16kb' }));

// PUBLIC ROUTES: login and signup use rate limits against repeated attempts.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false });
app.get('/api/health', async (_req, res, next) => {
  try { await db.query('SELECT 1'); res.json({ status: 'ok' }); } catch (err) { next(err); }
});

app.post('/api/signup', authLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    const issue = validateSignup(username, password);
    if (issue) return res.status(400).json({ error: issue });
    const hash = await bcrypt.hash(password, 12);
    // ROLE RULE: always editor on self-signup; never accept a role from the request.
    const result = await db.query(
      "INSERT INTO users (id, username, password_hash, role) VALUES ($1, $2, $3, 'editor') RETURNING id, username, role",
      [randomUUID(), username.toLowerCase(), hash]
    );
    res.status(201).json({ user: publicUser(result.rows[0]) });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Username already taken.' });
    next(err);
  }
});

app.post('/api/signin', authLimiter, async (req, res, next) => {
  try {
    const username = typeof req.body?.username === 'string' ? req.body.username.toLowerCase() : '';
    const password = req.body?.password;
    if (!username || typeof password !== 'string') return res.status(400).json({ error: 'Username and password required.' });
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (!rows.length || !await bcrypt.compare(password, rows[0].password_hash)) {
      return res.status(401).json({ error: 'Incorrect username or password.' });
    }
    const token = jwt.sign({}, process.env.JWT_SECRET, { subject: rows[0].id, algorithm: 'HS256', expiresIn: '7d' });
    res.json({ token, user: publicUser(rows[0]) });
  } catch (err) { next(err); }
});

// EVERYTHING BELOW: verify the signed JWT before returning any private data.
app.use('/api', requireLogin);
app.get('/api/me', (req, res) => res.json({ user: publicUser(req.user) }));

// READ: all signed-in users with read permission may see persisted tasks.
app.get('/api/todo', requireCapability('read'), async (_req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id, text, assignee, difficulty, complete, created_at FROM todos ORDER BY created_at DESC');
    res.json({ items: rows });
  } catch (err) { next(err); }
});

// CREATE: only create-capable users may insert tasks.
app.post('/api/todo', requireCapability('create'), async (req, res, next) => {
  try {
    const issue = validateTask(req.body);
    if (issue) return res.status(400).json({ error: issue });
    const { text, assignee = '', difficulty } = req.body;
    const { rows } = await db.query(
      'INSERT INTO todos (id, text, assignee, difficulty, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [randomUUID(), text.trim(), assignee.trim(), difficulty, req.user.id]
    );
    res.status(201).json({ item: rows[0] });
  } catch (err) { next(err); }
});

// UPDATE: support the standard RESTful PUT /todo/:id AND the lab's PUT /todo.
// This lab changes complete status, not the other task fields.
async function updateTodo(req, res, next) {
  try {
    const id = req.params.id || req.body?.id;
    if (!validId(id) || typeof req.body?.complete !== 'boolean') {
      return res.status(400).json({ error: 'A valid task ID and boolean complete value are required.' });
    }
    const { rows } = await db.query('UPDATE todos SET complete = $1 WHERE id = $2 RETURNING *', [req.body.complete, id]);
    if (!rows.length) return res.status(404).json({ error: 'Task not found.' });
    res.json({ item: rows[0] });
  } catch (err) { next(err); }
}
app.put('/api/todo/:id', requireCapability('update'), updateTodo);
app.put('/api/todo', requireCapability('update'), updateTodo);

// DELETE: only users with delete capability can remove tasks.
app.delete('/api/todo/:id', requireCapability('delete'), async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid task ID.' });
    const result = await db.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Task not found.' });
    res.status(204).send();
  } catch (err) { next(err); }
});

// ROLE MANAGEMENT: administrators can demonstrate reader, writer, editor, admin ACL.
app.get('/api/users', requireCapability('delete'), async (_req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id, username, role FROM users ORDER BY username');
    res.json({ users: rows.map(publicUser) });
  } catch (err) { next(err); }
});
app.patch('/api/users/:id/role', requireCapability('delete'), async (req, res, next) => {
  try {
    if (!validId(req.params.id) || !ROLE_CAPABILITIES[req.body?.role]) {
      return res.status(400).json({ error: 'Valid user ID and role required.' });
    }
    if (req.params.id === req.user.id && req.body.role !== 'admin') {
      return res.status(400).json({ error: 'You cannot remove your own admin role.' });
    }
    const { rows } = await db.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role', [req.body.role, req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: publicUser(rows[0]) });
  } catch (err) { next(err); }
});

// FINAL HANDLERS: use a 404 for unknown routes, keep stack traces off the client.
app.use((_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
app.use((err, _req, res, _next) => {
  console.error('API error:', err);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// STARTUP: do not accept requests until PostgreSQL tables exist.
initializeDatabase()
  .then(() => app.listen(Number(process.env.PORT) || 3001, () => console.log('Daymark API listening on port ' + (process.env.PORT || 3001))))
  .catch((err) => { console.error('Database setup failed:', err.message); process.exitCode = 1; db.end(); });
