import { FastifyPluginAsync } from 'fastify';
import { metricsSnapshot, setMetric } from './metrics.js';
import { queue } from '../../lib/queue.js';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';

async function emitAlert(payload: unknown) {
  if (!env.ALERT_WEBHOOK_URL) return { delivered: false, reason: 'WEBHOOK_NOT_CONFIGURED' };
  const res = await fetch(env.ALERT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return { delivered: res.ok, status: res.status };
}

const opsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/ops/dlq', async () => {
    const items = await queue.dlq(100);
    setMetric('queue_dlq_count', items.length);
    return { items, count: items.length };
  });

  app.get('/ops/metrics', async () => {
    const q = await queue.stats();
    setMetric('queue_waiting', q.waiting);
    setMetric('queue_active', q.active);
    setMetric('queue_failed', q.failed);
    setMetric('queue_delayed', q.delayed);

    const authFailures = (await prisma.securityEvent.findMany({ where: { type: 'AUTH_FAILURE' } })).length;
    setMetric('auth_failure_spikes', authFailures);

    return { metrics: metricsSnapshot(), queue: q };
  });

  app.get('/ops/dashboard', async () => {
    const q = await queue.stats();
    const alerts = [] as string[];
    if (q.failed > 0) alerts.push('QUEUE_FAILED_GT_0');
    if (q.waiting > 100) alerts.push('QUEUE_BACKLOG_HIGH');

    return {
      generatedAt: new Date().toISOString(),
      summary: {
        queue: q,
        metrics: metricsSnapshot(),
        syncConflicts: Number(metricsSnapshot().sync_conflict_total ?? 0)
      },
      alerts,
      status: alerts.length ? 'degraded' : 'ok'
    };
  });

  app.get('/ops/alerts', async () => {
    const snapshot = metricsSnapshot();
    const alertPayload = {
      at: new Date().toISOString(),
      alerts: [
        Number(snapshot.queue_failed ?? 0) > 0 ? 'QUEUE_FAILURES_PRESENT' : null,
        Number(snapshot.sync_conflict_total ?? 0) > 25 ? 'SYNC_CONFLICT_SPIKE' : null,
        Number(snapshot.auth_failure_spikes ?? 0) > 20 ? 'AUTH_FAILURE_SPIKE' : null
      ].filter(Boolean)
    };

    const fanout = await emitAlert(alertPayload);
    return { ...alertPayload, fanout };
  });


  app.get('/ops/metrics/prometheus', async (_req, reply) => {
    const q = await queue.stats();
    const metrics = metricsSnapshot();
    const lines = [
      `gramfund_queue_waiting ${q.waiting}`,
      `gramfund_queue_active ${q.active}`,
      `gramfund_queue_failed ${q.failed}`,
      `gramfund_queue_delayed ${q.delayed}`,
      `gramfund_sync_conflicts ${Number(metrics.sync_conflict_total ?? 0)}`,
      `gramfund_auth_failure_spikes ${Number(metrics.auth_failure_spikes ?? 0)}`
    ];
    reply.header('content-type', 'text/plain; version=0.0.4');
    return lines.join('\n');
  });

  app.get('/ops/security-events/export', async () => {
    const items = await prisma.securityEvent.findMany();
    return { exportedAt: new Date().toISOString(), count: items.length, items };
  });
};

export default opsRoutes;
