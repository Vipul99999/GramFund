import { FastifyReply, FastifyRequest } from 'fastify';

export async function requestContextMiddleware(request: FastifyRequest, _reply: FastifyReply) {
  const requestId = request.headers['x-request-id'] ?? request.id;
  request.log = request.log.child({ requestId });
}
