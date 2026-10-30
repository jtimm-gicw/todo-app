/**
 * Request validation helpers shared by API routes and tests.
 * Validate before sending values to PostgreSQL for clean 400 responses.
 */
export function validateSignup(username, password) {
  if (typeof username !== 'string' || !/^[a-zA-Z0-9._-]{3,30}$/.test(username)) {
    return 'Username must be 3–30 characters (letters, numbers, dot, underscore or hyphen).';
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return 'Password must be between 8 and 128 characters.';
  }
  return null;
}

export function validateTask(value) {
  if (!value || typeof value.text !== 'string' || !value.text.trim() || value.text.trim().length > 160) {
    return 'Task name is required (maximum 160 characters).';
  }
  if (value.assignee !== undefined && (typeof value.assignee !== 'string' || value.assignee.length > 80)) {
    return 'Assignee must be 80 characters or fewer.';
  }
  if (!Number.isInteger(value.difficulty) || value.difficulty < 1 || value.difficulty > 5) {
    return 'Difficulty must be a whole number from 1 to 5.';
  }
  return null;
}

export function validId(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
