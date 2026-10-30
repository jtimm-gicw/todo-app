/**
 * Role-based access control (ACL).
 * Every protected server route checks both the signature of the bearer token
 * AND the user's current role from PostgreSQL.
 */
import jwt from 'jsonwebtoken';
import { db } from './db.js';

// PERMISSIONS: users cannot grant themselves capabilities in the browser.
export const ROLE_CAPABILITIES = Object.freeze({
  reader: ['read'],
  writer: ['read', 'create'],
  editor: ['read', 'create', 'update'],
  admin: ['read', 'create', 'update', 'delete'],
});

export function canRole(role, capability) {
  return Boolean(ROLE_CAPABILITIES[role]?.includes(capability));
}

export function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    capabilities: ROLE_CAPABILITIES[user.role] || [],
  };
}

// AUTHENTICATION: verify token on the server and load the latest user record.
export async function requireLogin(req, res, next) {
  try {
    const match = /^Bearer (.+)$/i.exec(req.get('Authorization') || '');
    if (!match) return res.status(401).json({ error: 'Sign in required' });
    const payload = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const { rows } = await db.query('SELECT id, username, role FROM users WHERE id = $1', [payload.sub]);
    if (!rows.length) return res.status(401).json({ error: 'Account no longer exists' });
    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err.name === 'NotBeforeError') {
      return res.status(401).json({ error: 'Session expired or invalid. Please sign in.' });
    }
    next(err);
  }
}

// AUTHORIZATION: 403 means logged in but not allowed to perform the action.
export function requireCapability(capability) {
  return (req, res, next) => (
    canRole(req.user?.role, capability) ? next() : res.status(403).json({ error: 'You do not have permission to ' + capability + ' tasks.' })
  );
}
