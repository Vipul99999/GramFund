import crypto from 'node:crypto';

interface Session { id: string; userId: string; deviceId: string; refreshToken: string; expiresAt: number; active: boolean }
const sessions = new Map<string, Session>();

export class SessionService {
  create(userId: string, deviceId: string) {
    const id = crypto.randomUUID();
    const refreshToken = crypto.randomBytes(24).toString('hex');
    const session: Session = { id, userId, deviceId, refreshToken, expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, active: true };
    sessions.set(id, session);
    return session;
  }

  rotate(sessionId: string) {
    const session = sessions.get(sessionId);
    if (!session || !session.active || session.expiresAt < Date.now()) throw new Error('Invalid session');
    session.refreshToken = crypto.randomBytes(24).toString('hex');
    return session;
  }

  revoke(sessionId: string) {
    const session = sessions.get(sessionId);
    if (session) session.active = false;
  }
}
