import crypto from 'node:crypto';
import { env } from '../../config/env.js';

const ACCESS_TTL_SECONDS = 60 * 15;
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 30;

const getSecret = () => {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (env.NODE_ENV === 'production' && (!secret || secret === 'dev-only-change-me')) {
    throw new Error('AUTH_TOKEN_SECRET is required in production');
  }
  return secret || 'dev-only-change-me';
};

const b64 = (obj: unknown) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const sign = (data: string) => crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');

export type TokenPair = { accessToken: string; refreshToken: string; accessExpiresAt: number; refreshExpiresAt: number };

export function issueTokenPair(sub: string, sessionId: string): TokenPair {
  const now = Math.floor(Date.now() / 1000);
  const accessPayload = { sub, sid: sessionId, typ: 'access', iat: now, exp: now + ACCESS_TTL_SECONDS };
  const refreshPayload = { sub, sid: sessionId, typ: 'refresh', iat: now, exp: now + REFRESH_TTL_SECONDS, jti: crypto.randomUUID() };

  const accessBody = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(accessPayload)}`;
  const refreshBody = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(refreshPayload)}`;

  return {
    accessToken: `${accessBody}.${sign(accessBody)}`,
    refreshToken: `${refreshBody}.${sign(refreshBody)}`,
    accessExpiresAt: accessPayload.exp * 1000,
    refreshExpiresAt: refreshPayload.exp * 1000
  };
}

export function verifyToken(token: string, expectedType: 'access' | 'refresh') {
  const [head, payload, sig] = token.split('.');
  if (!head || !payload || !sig) throw new Error('Malformed token');
  const body = `${head}.${payload}`;
  if (sign(body) !== sig) throw new Error('Invalid signature');
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { typ: string; exp: number; sub: string; sid: string };
  if (data.typ !== expectedType) throw new Error('Invalid token type');
  if (data.exp * 1000 < Date.now()) throw new Error('Token expired');
  return data;
}
