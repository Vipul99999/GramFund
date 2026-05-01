import { FastifyReply, FastifyRequest } from 'fastify';

const seenKeys = new Set<string>();

export async function idempotencyMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const key = request.headers['idempotency-key'];
  if (!key || typeof key !== 'string') {
    return reply.code(400).send({ message: 'Idempotency-Key header is required' });
  }
  if (seenKeys.has(key)) {
    return reply.code(409).send({ message: 'Duplicate request' });
  }
  seenKeys.add(key);
}
