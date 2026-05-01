import { FastifyPluginAsync } from 'fastify';
import { notificationMetrics } from '../notification/notification.metrics.js';

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/ops/health', async () => ({ status: 'ok' }));
  app.get('/ops/dlq', async () => ({ message: 'Use BullMQ UI or Redis inspection for DLQ in production' }));
  app.get('/ops/metrics/notifications', async () => notificationMetrics);
};

export default plugin;
