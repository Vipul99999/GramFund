import crypto from 'node:crypto';
import { issueTokenPair, verifyToken } from '../../security/token.service.js';
import { prisma } from '../../../lib/prisma.js';

export class SessionService {
  async create(userId: string, deviceId: string) {
    const id = crypto.randomUUID();
    const pair = issueTokenPair(userId, id);
    await prisma.userSession.create({
      data: { id, userId, deviceId, refreshToken: pair.refreshToken, expiresAt: pair.refreshExpiresAt, active: true }
    });
    return { sessionId: id, ...pair };
  }

  async rotate(refreshToken: string) {
    const payload = verifyToken(refreshToken, 'refresh');
    const session = await prisma.userSession.findUnique({ where: { id: payload.sid } }) as any;
    if (!session || !session.active || Number(session.expiresAt) < Date.now()) throw new Error('Invalid session');
    const pair = issueTokenPair(session.userId as string, session.id as string);
    await prisma.userSession.update({ where: { id: session.id }, data: { refreshToken: pair.refreshToken, expiresAt: pair.refreshExpiresAt } });
    return { sessionId: session.id, ...pair };
  }

  async revoke(sessionId: string) {
    await prisma.userSession.upsert({ where: { id: sessionId }, create: { id: sessionId, active: false }, update: { active: false } });
  }
}
