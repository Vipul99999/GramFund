import crypto from 'node:crypto';
import { issueTokenPair, verifyToken } from '../../security/token.service.js';

interface Session { id: string; userId: string; deviceId: string; refreshToken: string; expiresAt: number; active: boolean }
const sessions = new Map<string, Session>();

export class SessionService {
  create(userId: string, deviceId: string) {
    const id = crypto.randomUUID();
    const pair = issueTokenPair(userId, id);
    const session: Session = { id, userId, deviceId, refreshToken: pair.refreshToken, expiresAt: pair.refreshExpiresAt, active: true };
    sessions.set(id, session);
    return { sessionId: id, ...pair };
  }

  rotate(refreshToken: string) {
    const payload = verifyToken(refreshToken, 'refresh');
    const session = sessions.get(payload.sid);
    if (!session || !session.active || session.expiresAt < Date.now()) throw new Error('Invalid session');
    const pair = issueTokenPair(session.userId, session.id);
    session.refreshToken = pair.refreshToken;
    session.expiresAt = pair.refreshExpiresAt;
    return { sessionId: session.id, ...pair };
  }

  revoke(sessionId: string) {
    const session = sessions.get(sessionId);
    if (session) session.active = false;
  }
}
