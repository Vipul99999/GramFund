import { FastifyPluginAsync } from 'fastify';

const sanctions = new Set(['sanctioned-entity', 'blocked-wallet']);
const cases: Array<{ id: string; reason: string; createdAt: string; subject: string }> = [];

const routes: FastifyPluginAsync = async (app) => {
  app.post('/compliance/kyc/check', async (req) => {
    const body = req.body as { userId: string; country?: string; documentVerified?: boolean };
    return {
      userId: body.userId,
      status: body.documentVerified ? 'KYC_PASSED' : 'KYC_REVIEW_REQUIRED',
      country: body.country ?? 'UNKNOWN'
    };
  });

  app.post('/compliance/sanctions/screen', async (req) => {
    const body = req.body as { subject: string };
    const flagged = sanctions.has(body.subject.toLowerCase());
    return { subject: body.subject, flagged, list: flagged ? 'INTERNAL_BLOCKLIST' : null };
  });

  app.post('/compliance/cases', async (req) => {
    const body = req.body as { subject: string; reason: string };
    const c = { id: `case_${cases.length + 1}`, subject: body.subject, reason: body.reason, createdAt: new Date().toISOString() };
    cases.push(c);
    return c;
  });

  app.get('/compliance/cases', async () => ({ items: cases }));
};

export default routes;
