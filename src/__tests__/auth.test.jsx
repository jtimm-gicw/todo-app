/**
 * Phase 3 + 4 tests: authenticated UI is capability-controlled, and
 * a cookie is not accepted as a session until GET /me validates it.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Auth from '../Components/Auth/Auth';
import AuthProvider, { AuthContext } from '../Context/Auth/Auth';

beforeEach(() => {
  document.cookie = 'daymark_auth=; path=/; Max-Age=0';
});
afterEach(() => vi.unstubAllGlobals());

describe('Auth Context', () => {
  it('starts logged out if no cookie is present', async () => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <span>{value.isLoggedIn ? 'Signed in' : 'Signed out'}</span>}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    expect(await screen.findByText('Signed out')).toBeInTheDocument();
  });

  it('does not trust a cookie until the server verifies it', async () => {
    document.cookie = 'daymark_auth=sampletoken; path=/';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: '1', username: 'student', role: 'reader', capabilities: ['read'] } }),
    }));
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <>
              <span>{value.isLoggedIn ? 'Signed in' : 'Signed out'}</span>
              <Auth capability="read"><p>Reader content</p></Auth>
              <Auth capability="delete"><p>Admin content</p></Auth>
            </>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByText('Signed in')).toBeInTheDocument());
    expect(screen.getByText('Reader content')).toBeInTheDocument();
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/api/me', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer sampletoken' }),
    }));
  });

  it('clears a rejected session cookie', async () => {
    document.cookie = 'daymark_auth=invalid; path=/';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid token' }),
    }));
    render(<AuthProvider><AuthContext.Consumer>{(value) => <span>{value.authLoading ? 'Checking' : 'Checked'}</span>}</AuthContext.Consumer></AuthProvider>);
    await screen.findByText('Checked');
    expect(document.cookie).not.toContain('daymark_auth=invalid');
  });
});
