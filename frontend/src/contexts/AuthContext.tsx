'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest, LoginResponse } from '../lib/apiClient';
import { SessionUser } from '../types/api';

type AuthState = { user: SessionUser | null; csrfToken: string | null; loading: boolean; lockoutUntil?: string; login: (identifier: string, password: string) => Promise<string | null>; logoutAll: () => Promise<void>; refresh: () => Promise<void>; hasRole: (roles: SessionUser['role'][]) => boolean };
const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [csrfToken, setCsrf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lockoutUntil, setLockout] = useState<string | undefined>();

  async function refresh() {
    const r = await apiRequest<{ user: SessionUser; csrfToken: string }>('/api/v1/auth/refresh', { method: 'POST' });
    if (r.ok) { setUser(r.data.user); setCsrf(r.data.csrfToken); } else { setUser(null); setCsrf(null); }
  }
  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

  async function login(identifier: string, password: string) {
    const r = await apiRequest<LoginResponse>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) });
    if (!r.ok) return r.error.message;
    setUser(r.data.user); setCsrf(r.data.csrfToken); setLockout(r.data.lockoutUntil); return null;
  }
  async function logoutAll() { await apiRequest('/api/v1/auth/logout-all', { method: 'POST', csrfToken: csrfToken || undefined }); setUser(null); setCsrf(null); }

  const value = useMemo(() => ({ user, csrfToken, loading, lockoutUntil, login, logoutAll, refresh, hasRole: (roles: SessionUser['role'][]) => !!user && roles.includes(user.role) }), [user, csrfToken, loading, lockoutUntil]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => { const c = useContext(AuthCtx); if (!c) throw new Error('AuthProvider missing'); return c; };
