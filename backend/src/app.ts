import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { API_PREFIX, APP_NAME } from './config/constants.js';
import loggerPlugin from './plugins/logger.plugin.js';
import authPlugin from './plugins/auth.plugin.js';
import abacPlugin from './plugins/abac.plugin.js';
import cachePlugin from './plugins/cache.plugin.js';
import rateLimitPlugin from './plugins/rateLimit.plugin.js';
import etagPlugin from './plugins/etag.plugin.js';
import prismaPlugin from './plugins/prisma.plugin.js';
import authModule from './modules/auth/auth.plugin.js';
import familyModule from './modules/family/family.plugin.js';
import paymentModule from './modules/payment/payment.plugin.js';
import eventModule from './modules/event/event.plugin.js';
import handlerModule from './modules/handler/handler.plugin.js';
import settlementModule from './modules/settlement/settlement.plugin.js';
import disputeModule from './modules/dispute/dispute.plugin.js';
import reportModule from './modules/report/report.plugin.js';
import notificationModule from './modules/notification/notification.plugin.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { auditMiddleware } from './middleware/audit.middleware.js';
import { registerErrorHandler } from './middleware/error.middleware.js';
import { idempotencyMiddleware } from './middleware/idempotency.middleware.js';
import { fraudMiddleware } from './middleware/fraud.middleware.js';
import { abacMiddleware } from './middleware/abac.middleware.js';
import { requestContextMiddleware } from './middleware/requestContext.middleware.js';
import transactionRoutes from './modules/transaction/http/transaction.routes.js';
import manifestRoutes from './api/manifest.routes.js';
import syncRoutes from './modules/sync/sync.routes.js';
import opsRoutes from './modules/ops/ops.routes.js';

export const buildApp = () => {
  const app = Fastify({ logger: { level: 'info' } });

  app.register(cors);
  app.register(helmet);

  app.register(loggerPlugin);
  app.register(authPlugin);
  app.register(abacPlugin);
  app.register(cachePlugin);
  app.register(rateLimitPlugin);
  app.register(etagPlugin);
  app.register(prismaPlugin);

  app.addHook('onRequest', requestContextMiddleware);
  app.addHook('onRequest', loggerMiddleware);
  app.addHook('preHandler', auditMiddleware);

  app.get('/health', async () => ({ name: APP_NAME, status: 'ok' }));
  app.post('/api/v1/transactions', { preHandler: [idempotencyMiddleware, fraudMiddleware, abacMiddleware('transaction.create')] }, async () => ({ ok: true }));
  app.post('/api/v1/payments', { preHandler: [idempotencyMiddleware, fraudMiddleware, abacMiddleware('payment.create')] }, async () => ({ ok: true }));

  app.register(async (api) => {
    api.register(authModule);
    api.register(familyModule);
    api.register(paymentModule);
    api.register(transactionRoutes);
    api.register(eventModule);
    api.register(handlerModule);
    api.register(settlementModule);
    api.register(disputeModule);
    api.register(reportModule);
    api.register(notificationModule);
    api.register(manifestRoutes);
    api.register(syncRoutes);
    api.register(opsRoutes);
  }, { prefix: API_PREFIX });

  registerErrorHandler(app);

  return app;
};

