import { ApiResult, ApiError, SessionUser } from '../types/api';

const RETRYABLE = new Set([502, 503, 504]);

function mapError(status?: number, message = 'Request failed'): ApiError {
  if (!status) return { type: 'network', message };
  if (status === 401 || status === 403) return { type: 'auth', status, message };
  if (status === 400 || status === 422) return { type: 'validation', status, message };
  if (status >= 500) return { type: 'server', status, message };
  return { type: 'unknown', status, message };
}

async function parseJsonSafe(res: Response) { try { return await res.json(); } catch { return null; } }

export async function apiRequest<T>(url: string, init: RequestInit & { timeoutMs?: number; retries?: number; csrfToken?: string } = {}): Promise<ApiResult<T>> {
  const { timeoutMs = 10000, retries = 0, csrfToken, ...rest } = init;
  const method = (rest.method || 'GET').toUpperCase();
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers = new Headers(rest.headers || {});
    headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
    if (csrfToken && method !== 'GET') headers.set('x-csrf-token', csrfToken);
    const res = await fetch(url, { ...rest, headers, signal: controller.signal, credentials: 'include' });
    if (!res.ok) {
      if (method === 'GET' && retries > 0 && RETRYABLE.has(res.status)) return apiRequest<T>(url, { ...init, retries: retries - 1 });
      const payload = await parseJsonSafe(res);
      return { ok: false, error: mapError(res.status, payload?.error?.message || `HTTP ${res.status}`) };
    }
    return { ok: true, data: await res.json() as T };
  } catch (e) {
    return { ok: false, error: mapError(undefined, e instanceof Error ? e.message : 'Network failure') };
  } finally { clearTimeout(t); }
}

export type LoginResponse = { accessToken: string; refreshToken: string; user: SessionUser; csrfToken: string; lockoutUntil?: string };
