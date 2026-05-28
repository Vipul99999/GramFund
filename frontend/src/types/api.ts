export type ApiErrorType = 'network' | 'auth' | 'validation' | 'server' | 'unknown';
export type ApiError = { type: ApiErrorType; status?: number; message: string };
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export type UserRole = 'ADMIN' | 'HANDLER' | 'FAMILY' | 'COMMUNITY_ADMIN';
export type SessionUser = { id: string; role: UserRole; name: string };
