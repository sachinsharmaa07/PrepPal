/**
 * Client-side auth utilities.
 * JWT is stored in localStorage under the key 'preppal_token'.
 */

export type UserPayload = {
  userId: string;
  role: 'STUDENT' | 'RECRUITER' | 'ADMIN';
  iat?: number;
  exp?: number;
};

const TOKEN_KEY = 'preppal_token';
const USER_KEY = 'preppal_user';

/** Save token and user info after login/register */
export function saveAuth(token: string, user: { id: string; name: string; email: string; role: string }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Clear auth state on logout */
export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Get raw JWT token */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Get stored user object (fast, no decode needed) */
export function getStoredUser(): { id: string; name: string; email: string; role: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Decode JWT payload without verification (client-side only) */
export function decodeToken(token: string): UserPayload | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded as UserPayload;
  } catch {
    return null;
  }
}

/** Get current user from localStorage */
export function getCurrentUser() {
  const user = getStoredUser();
  if (!user) return null;
  return user;
}

/** Check if current user is a recruiter */
export function isRecruiter(): boolean {
  const user = getCurrentUser();
  return user?.role === 'RECRUITER';
}

/** Check if current user is a student */
export function isStudent(): boolean {
  const user = getCurrentUser();
  return user?.role === 'STUDENT';
}

/** Get user initials for avatar */
export function getUserInitials(name?: string): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Get dashboard route based on role */
export function getDashboardRoute(role: string): string {
  return role === 'RECRUITER' ? '/recruiter/dashboard' : '/dashboard';
}
