import { FastifyPluginAsync } from 'fastify';
import { routeNotification } from '../notification/notification-policy.service.js';

const confirmations: Array<{
  id: string;
  transactionId: string;
  side: 'PAYER' | 'RECEIVER';
  channel: 'PUSH' | 'SMS' | 'MANUAL';
  confirmed: boolean;
  createdAt: string;
}> = [];

const handlerLedger: Record<string, { totalCollected: number; totalDelivered: number }> = {};

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/payment', async () => ({ module: 'payment', status: 'ok' }));

  app.post('/payments/confirmations', async (req) => {
    const body = req.body as {
      transactionId: string;
      side: 'PAYER' | 'RECEIVER';
      channel?: 'PUSH' | 'SMS' | 'MANUAL';
      confirmed?: boolean;
    };

    const record = {
      id: `cnf_${confirmations.length + 1}`,
      transactionId: body.transactionId,
      side: body.side,
      channel: body.channel ?? 'PUSH',
      confirmed: body.confirmed ?? false,
      createdAt: new Date().toISOString()
    };
    confirmations.push(record);
    await routeNotification({
      userKey: body.transactionId,
      villageId: 'global',
      purpose: 'PAYMENT_CONFIRMATION',
      message: `Confirmation ${body.side} for ${body.transactionId}`,
      priority: body.side === 'PAYER' ? 'CRITICAL' : 'IMPORTANT',
      channels: ['PUSH', 'SMS', 'MANUAL']
    });
    return record;
  });

  app.get('/payments/confirmations', async () => ({ items: confirmations }));

  app.post('/handlers/:handlerId/ledger', async (req) => {
    const { handlerId } = req.params as { handlerId: string };
    const body = req.body as { collected?: number; delivered?: number };
    const current = handlerLedger[handlerId] ?? { totalCollected: 0, totalDelivered: 0 };
    const next = {
      totalCollected: current.totalCollected + (body.collected ?? 0),
      totalDelivered: current.totalDelivered + (body.delivered ?? 0)
    };
    handlerLedger[handlerId] = next;
    return { handlerId, ...next, pendingAmount: next.totalCollected - next.totalDelivered };
  });

  app.get('/handlers/:handlerId/transparency', async (req) => {
    const { handlerId } = req.params as { handlerId: string };
    const current = handlerLedger[handlerId] ?? { totalCollected: 0, totalDelivered: 0 };
    return {
      handlerId,
      totalCollected: current.totalCollected,
      totalDelivered: current.totalDelivered,
      pendingAmount: current.totalCollected - current.totalDelivered,
      riskSignal: current.totalCollected - current.totalDelivered > 0 ? 'PENDING_SETTLEMENT' : 'CLEAR'
    };
  });
};

export default plugin;
