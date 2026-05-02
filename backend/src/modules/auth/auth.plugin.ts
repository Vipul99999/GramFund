import { FastifyPluginAsync } from 'fastify';
import { OtpService } from './application/otp.service.js';
import { SessionService } from './application/session.service.js';

const otp = new OtpService();
const sessions = new SessionService();

const plugin: FastifyPluginAsync = async (app) => {
  app.post('/auth/login', async (req) => {
    const body = req.body as { phone: string; otp?: string; deviceId: string };
    if (!body.otp) return otp.issue(body.phone);
    otp.verify(body.phone, body.otp);
    return sessions.create(body.phone, body.deviceId);
  });

  app.post('/auth/refresh-token', async (req) => {
    const body = req.body as { sessionId: string };
    return sessions.rotate(body.sessionId);
  });

  app.post('/auth/logout', async (req) => {
    const body = req.body as { sessionId: string };
    sessions.revoke(body.sessionId);
    return { ok: true };
  });
};

export default plugin;
