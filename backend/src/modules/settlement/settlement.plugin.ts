import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../../lib/prisma.js';
import { incMetric } from '../ops/metrics.js';

const SLA_HOURS = 48;

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/settlement', async () => ({ module: 'settlement', status: 'ok' }));

  app.post('/settlements', async (req) => {
    const body = req.body as { eventId: string; handlerId: string; totalCollected: number; handlerCommission?: number };
    const now = new Date();
    const record = await prisma.eventSettlement.create({
      data: {
        id: `st_${Date.now()}`,
        eventId: body.eventId,
        handlerId: body.handlerId,
        totalCollected: body.totalCollected,
        handlerCommission: body.handlerCommission ?? 0,
        netPayout: body.totalCollected - (body.handlerCommission ?? 0),
        deliveredAmount: 0,
        status: 'PENDING',
        confirmedByFamily: false,
        createdAt: now,
        updatedAt: now
      } as any
    });
    return record;
  });

  app.post('/settlements/:id/deliver', async (req) => {
    const { id } = req.params as { id: string };
    const body = req.body as { amount: number };
    const existing = await prisma.eventSettlement.findUnique({ where: { id } }) as any;
    if (!existing) throw new Error('Settlement not found');

    const deliveredAmount = Number(existing.deliveredAmount ?? 0) + body.amount;
    const totalCollected = Number(existing.totalCollected);
    const status = deliveredAmount >= totalCollected ? 'PAID' : 'PARTIAL';
    const pendingAmount = Math.max(totalCollected - deliveredAmount, 0);

    if (pendingAmount > 0) incMetric('settlement_pending_total');

    return prisma.eventSettlement.update({
      where: { id },
      data: { deliveredAmount, status, pendingAmount, updatedAt: new Date() } as any
    });
  });

  app.post('/settlements/:id/confirm', async (req) => {
    const { id } = req.params as { id: string };
    const body = req.body as { confirmed: boolean; note?: string };
    if (!body.confirmed) incMetric('settlement_receiver_reject_total');
    return prisma.eventSettlement.update({
      where: { id },
      data: { confirmedByFamily: body.confirmed, confirmationNote: body.note ?? null, confirmedAt: new Date(), status: body.confirmed ? 'PAID' : 'DISPUTED' } as any
    });
  });

  app.get('/settlements/:id', async (req) => {
    const { id } = req.params as { id: string };
    return prisma.eventSettlement.findUnique({ where: { id } });
  });

  app.get('/settlements/handler/:handlerId/pending', async (req) => {
    const { handlerId } = req.params as { handlerId: string };
    const rows = await prisma.eventSettlement.findMany({ where: { handlerId } } as any);
    const now = Date.now();

    const items = (rows as any[]).map((row) => {
      const createdAt = new Date(row.createdAt).getTime();
      const ageHours = (now - createdAt) / (1000 * 60 * 60);
      const pendingAmount = Number(row.pendingAmount ?? Math.max(Number(row.totalCollected) - Number(row.deliveredAmount ?? 0), 0));
      return {
        ...row,
        pendingAmount,
        delayed: pendingAmount > 0 && ageHours > SLA_HOURS,
        ageHours: Math.round(ageHours)
      };
    });

    const riskCount = items.filter((i) => i.delayed).length;
    if (riskCount > 0) incMetric('settlement_sla_breach_total', riskCount);

    return { items, summary: { pendingCount: items.filter((i) => i.pendingAmount > 0).length, delayedCount: riskCount } };
  });
};

export default plugin;
