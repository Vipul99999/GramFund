import { FastifyPluginAsync } from 'fastify';
import { OtpService } from './application/otp.service.js';
import { SessionService } from './application/session.service.js';
import { assessRisk, markFailure, resetFailures } from '../security/risk.service.js';
import { ensureUserByEmail, ensureUserByPhone, loginWithEmail } from './application/identity.service.js';
import { prisma } from '../../lib/prisma.js';

const otp = new OtpService();
const sessions = new SessionService();

const isEmail = (v: string) => v.includes('@');

const plugin: FastifyPluginAsync = async (app) => {
  app.post('/auth/login', async (req) => {
    const body = req.body as { identifier: string; password?: string; otp?: string; deviceId: string; ip?: string; provider?: 'google'; villageId?: string };
    try {
      if (body.provider === 'google') {
        const user = await ensureUserByEmail(body.identifier);
        return sessions.create(user.id as string, body.deviceId);
      }

      if (isEmail(body.identifier)) {
        if (!body.password) return { code: 'PASSWORD_REQUIRED' };
        const user = await loginWithEmail(body.identifier, body.password);
        return sessions.create(user.id as string, body.deviceId);
      }

      const risk = await assessRisk({ key: body.identifier, ip: body.ip, deviceId: body.deviceId });
      if (risk.blocked) return { code: risk.reason };
      if (!body.otp) return { ...(await otp.issue(body.identifier, body.villageId)), risk: risk.reason, mode: 'OTP_SENT' };

      await otp.verify(body.identifier, body.otp);
      await resetFailures(body.identifier);
      const user = await ensureUserByPhone(body.identifier);
      return sessions.create(user.id as string, body.deviceId);
    } catch (error: any) {
      await markFailure(body.identifier, body.ip, body.deviceId);
      await prisma.securityEvent.create({ data: { type: 'AUTH_FAILURE_EXCEPTION', identifier: body.identifier, reason: error?.message ?? 'UNKNOWN', createdAt: Date.now() } });
      throw error;
    }
  });

  app.post('/auth/signup-email', async (req) => {
    const body = req.body as { email: string; password: string };
    const user = await ensureUserByEmail(body.email, body.password);
    return { userId: user.id };
  });

  app.post('/auth/forgot-password', async (req) => {
    const body = req.body as { email: string };
    const token = `reset_${Date.now()}`;
    await prisma.passwordReset.create({ data: { email: body.email, token, expiresAt: Date.now() + 1000 * 60 * 15 } });
    return { ok: true, token };
  });

  app.post('/auth/refresh-token', async (req) => {
    const body = req.body as { refreshToken: string };
    return sessions.rotate(body.refreshToken);
  });

  app.post('/auth/logout', async (req) => {
    const body = req.body as { sessionId: string };
    await sessions.revoke(body.sessionId);
    return { ok: true };
  });
};

export default plugin;
