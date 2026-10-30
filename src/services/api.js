/**
 * Shared API client.
 * Sends JSON requests, attaches the Bearer token, and provides readable errors.
 * Every actual create/read/update/delete request goes through this file.
 */
const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

// HTTP REQUEST: automatically encode bodies and handle error responses.
export async function apiRequest(path, { method = 'GET', token, body, signal } = {}) {
  const response = await fetch(API_URL + path, {
    method,
    signal,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  // ERROR HANDLING: the API may return JSON or an empty error response.
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error || ('Request failed (' + response.status + ')');
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return payload;
}
