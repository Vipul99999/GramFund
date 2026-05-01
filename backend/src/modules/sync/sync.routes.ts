import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../../lib/prisma.js';
import { requireIdempotencyKey } from '../../core/invariants.js';

const syncRoutes: FastifyPluginAsync = async (app) => {
  app.post('/sync', async (request, reply) => {
    const body = request.body as { id: string; type: string; payload: unknown; idempotencyKey: string };
    const keyCheck = requireIdempotencyKey(body.idempotencyKey);
    if (!keyCheck.ok) return reply.code(400).send({ code: 'INVALID_IDEMPOTENCY', message: keyCheck.reason });

    const existing = await prisma.syncReplay.findUnique({ where: { idempotencyKey: body.idempotencyKey } });
    if (existing) {
      return reply.code(409).send({ code: 'DUPLICATE', message: 'Action already synced', resolution: 'SERVER_WINS' });
    }

    await prisma.syncReplay.create({ data: body as unknown as Record<string, unknown> });
    return reply.code(202).send({ code: 'SYNC_ACCEPTED', actionId: body.id });
  });
};

export default syncRoutes;
