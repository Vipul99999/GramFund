import { FastifyReply, FastifyRequest } from 'fastify';

export async function fraudMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const amount = Number((request.body as Record<string, unknown> | undefined)?.amount ?? 0);
  if (amount > 500000) {
    return reply.code(422).send({ message: 'Suspicious transaction amount' });
  }
}
