import { FastifyPluginAsync } from 'fastify';
import { queue } from '../../lib/queue.js';
import { metricsSnapshot } from './metrics.js';

const opsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/ops/dlq', async () => ({ message: 'Use BullMQ UI or Redis inspection for DLQ in production' }));
  app.get('/ops/metrics', async () => ({ metrics: metricsSnapshot() }));
};

export default opsRoutes;
