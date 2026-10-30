/**
 * Phase 4 tests: authenticated requests and user-friendly HTTP errors.
 */
import { afterEach, expect, it, vi } from 'vitest';
import { apiRequest } from './api';

afterEach(() => vi.unstubAllGlobals());

it('adds an authorization header for protected routes', async () => {
  const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [] }) });
  vi.stubGlobal('fetch', mockFetch);
  expect(await apiRequest('/todo', { token: 'abc' })).toEqual({ items: [] });
  expect(mockFetch).toHaveBeenCalledWith('/api/todo', expect.objectContaining({
    headers: expect.objectContaining({ Authorization: 'Bearer abc' }),
  }));
});

it('raises the server error message if authorization fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: false, status: 403, json: async () => ({ error: 'Permission denied' }),
  }));
  await expect(apiRequest('/todo', { token: 'abc' })).rejects.toThrow('Permission denied');
});
