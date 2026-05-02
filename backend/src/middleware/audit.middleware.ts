import { FastifyReply, FastifyRequest } from 'fastify';

export async function auditMiddleware(request: FastifyRequest, _reply: FastifyReply) {
  request.log.info({ method: request.method, url: request.url }, 'audit');
}
