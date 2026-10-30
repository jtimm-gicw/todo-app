/**
 * Phase 3 + Phase 4: authentication and authorization context.
 * Users sign in via the real API, not a hard-coded credentials list.
 * On reload, the cookie is accepted only after GET /me verifies the token.
 * IMPORTANT: server routes MUST also check capabilities; UI checks are cosmetic.
 */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../services/api';

export const AuthContext = createContext(null);
const COOKIE_NAME = 'daymark_auth';

// COOKIE HELPERS: fulfill the lab cookie requirement.
// For production, prefer HttpOnly Secure cookies set by the server to reduce XSS risk.
function readCookie() {
  const match = document.cookie.split('; ').find((part) => part.startsWith(COOKIE_NAME + '='));
  return match ? decodeURIComponent(match.slice(COOKIE_NAME.length + 1)) : null;
}
function writeCookie(token) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = COOKIE_NAME + '=' + encodeURIComponent(token) + '; path=/; SameSite=Lax; Max-Age=604800' + secure;
}
function clearCookie() {
  document.cookie = COOKIE_NAME + '=; path=/; Max-Age=0; SameSite=Lax';
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  // LOGOUT: clear both React session state and the browser cookie.
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError('');
    clearCookie();
  }, []);

  // RESTORE SESSION: a decoded JWT alone cannot prove validity.
  useEffect(() => {
    const savedToken = readCookie();
    if (!savedToken) {
      setAuthLoading(false);
      return;
    }
    let active = true;
    apiRequest('/me', { token: savedToken })
      .then((profile) => {
        if (active) {
          setUser(profile.user);
          setToken(savedToken);
        }
      })
      .catch(() => { if (active) logout(); })
      .finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, [logout]);

  // SIGN IN: server validates credentials and returns a short-lived JWT.
  const login = async (username, password) => {
    setError('');
    try {
      const result = await apiRequest('/signin', { method: 'POST', body: { username, password } });
      // Verify identity and capabilities from the authenticated server response.
      const profile = await apiRequest('/me', { token: result.token });
      setUser(profile.user);
      setToken(result.token);
      writeCookie(result.token);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // SIGN UP: new accounts cannot choose their own privileged role.
  const register = async (username, password) => {
    setError('');
    try {
      await apiRequest('/signup', { method: 'POST', body: { username, password } });
      return await login(username, password);
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // CAPABILITY CHECK: used by <Auth /> and mutation controls.
  const can = useCallback((capability) => (
    Boolean(user && user.capabilities?.includes(capability))
  ), [user]);

  const value = useMemo(() => ({
    user, token, error, authLoading, isLoggedIn: Boolean(user && token),
    login, register, logout, can,
  }), [user, token, error, authLoading, logout, can]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
