import { FastifyReply, FastifyRequest } from 'fastify';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }
  const token = authHeader.slice('Bearer '.length);
  (request as FastifyRequest & { user?: { id: string; role: string } }).user = { id: token, role: 'HANDLER' };
}
