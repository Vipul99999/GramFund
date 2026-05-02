import { FastifyPluginAsync } from 'fastify';
import { NotificationService } from './notification.service.js';
import { queue } from '../../lib/queue.js';
import { abacMiddleware } from '../../middleware/abac.middleware.js';
import { createNotificationSchema } from './notification.schema.js';

const service = new NotificationService();

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/notifications', { preHandler: [abacMiddleware('notification.view')] }, async () => service.list());

  app.get('/notifications/manual-pending', { preHandler: [abacMiddleware('notification.view')] }, async () => service.listManualPending(24));

  app.post('/notifications', { preHandler: [abacMiddleware('notification.create')] }, async (request: any, reply) => {
    const parsed = createNotificationSchema.safeParse(request.body ?? {});
    if (!parsed.success) return reply.code(400).send({ message: 'Validation failed', errors: parsed.error.flatten() });

    const created = await service.create(parsed.data);
    await queue.enqueue('notification.send', {
      notificationId: created.id,
      userId: parsed.data.userId,
      familyId: parsed.data.familyId,
      to: parsed.data.to,
      message: parsed.data.message,
      priority: parsed.data.priority,
      attempt: 1,
      channelsTried: ['IN_APP']
    });

    return created;
  });

  app.patch('/notifications/:id/read', { preHandler: [abacMiddleware('notification.view', (req: any) => ({ familyId: req.user?.familyId }))] }, async (request: any, reply) => {
    const updated = await service.confirmManual(request.params.id);
    if (!updated) return reply.code(404).send({ message: 'Notification not found' });
    return updated;
  });
};

export default plugin;
