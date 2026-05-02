import { FastifyPluginAsync } from 'fastify';
import { metricsSnapshot } from './metrics.js';

const opsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/ops/dlq', async () => ({ message: 'Use BullMQ UI or Redis inspection for DLQ in production' }));
  app.get('/ops/metrics', async () => ({ metrics: metricsSnapshot() }));
  app.get('/ops/dashboard', async () => ({
    generatedAt: new Date().toISOString(),
    summary: metricsSnapshot(),
    status: 'ok'
  }));
  app.get('/ops/alerts', async () => ({
    generatedAt: new Date().toISOString(),
    alerts: [],
    note: 'Integrate with PagerDuty/Opsgenie/Webhook for production alert fanout'
  }));
};

export default opsRoutes;
