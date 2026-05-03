import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../../lib/prisma.js';
import { requireIdempotencyKey } from '../../core/invariants.js';
import { incMetric } from '../ops/metrics.js';

const inFlight = new Set<string>();

const syncRoutes: FastifyPluginAsync = async (app) => {
  app.post('/sync', async (request, reply) => {
    const body = request.body as { id: string; type: string; payload: unknown; idempotencyKey: string };
    const keyCheck = requireIdempotencyKey(body.idempotencyKey);
    if (!keyCheck.ok) return reply.code(400).send({ code: 'INVALID_IDEMPOTENCY', message: keyCheck.reason });

    if (inFlight.has(body.idempotencyKey)) {
      incMetric('sync_conflict_total');
      return reply.code(409).send({ code: 'DUPLICATE_IN_FLIGHT', message: 'Action is already processing', resolution: 'SERVER_WINS' });
    }

    inFlight.add(body.idempotencyKey);
    try {
      const existing = await prisma.syncReplay.findUnique({ where: { idempotencyKey: body.idempotencyKey } });
      if (existing) {
        incMetric('sync_conflict_total');
        return reply.code(409).send({ code: 'DUPLICATE', message: 'Action already synced', resolution: 'SERVER_WINS' });
      }

      await prisma.syncReplay.create({ data: body as unknown as Record<string, unknown> });
      incMetric('sync_accepted_total');
      return reply.code(202).send({ code: 'SYNC_ACCEPTED', actionId: body.id });
    } finally {
      inFlight.delete(body.idempotencyKey);
    }
  });
};

export default syncRoutes;
