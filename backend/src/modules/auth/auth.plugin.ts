import { FastifyPluginAsync } from 'fastify';
import { OtpService } from './application/otp.service.js';
import { SessionService } from './application/session.service.js';
import { assessRisk, markFailure, resetFailures } from '../security/risk.service.js';
import { ensureUserByEmail, ensureUserByPhone, loginWithEmail } from './application/identity.service.js';

const otp = new OtpService();
const sessions = new SessionService();

const isEmail = (v: string) => v.includes('@');

const plugin: FastifyPluginAsync = async (app) => {
  app.post('/auth/login', async (req) => {
    const body = req.body as { identifier: string; password?: string; otp?: string; deviceId: string; ip?: string; provider?: 'google' };
    if (body.provider === 'google') {
      const user = await ensureUserByEmail(body.identifier);
      return sessions.create(user.id as string, body.deviceId);
    }

    if (isEmail(body.identifier)) {
      if (!body.password) return { code: 'PASSWORD_REQUIRED' };
      const user = await loginWithEmail(body.identifier, body.password);
      return sessions.create(user.id as string, body.deviceId);
    }

    const risk = assessRisk({ key: body.identifier, ip: body.ip, deviceId: body.deviceId });
    if (risk.blocked) return { code: risk.reason };
    if (!body.otp) return { ...otp.issue(body.identifier), risk: risk.reason, mode: 'OTP_SENT' };
    try {
      otp.verify(body.identifier, body.otp);
      resetFailures(body.identifier);
      const user = await ensureUserByPhone(body.identifier);
      return sessions.create(user.id as string, body.deviceId);
    } catch {
      markFailure(body.identifier);
      throw new Error('Invalid OTP');
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
    sessions.revoke(body.sessionId);
    return { ok: true };
  });
};

import { prisma } from '../../lib/prisma.js';
export default plugin;
