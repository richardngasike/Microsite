/**
 * Auth utilities — token storage, retrieval, and the /auth/me/ check.
 *
 * Why not a full React context here? This site is a STATIC export. Contexts
 * that wrap the whole tree need to live in a client-side provider. We keep
 * the raw helpers here and export a lightweight hook (useAuth) from a
 * separate client file so server components are never affected.
 */

export const TOKEN_KEY = "unaids_token";
export const USER_KEY  = "unaids_user";

export function saveSession(token, user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getToken());
}