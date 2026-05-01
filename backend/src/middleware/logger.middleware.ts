import { FastifyReply, FastifyRequest } from 'fastify';

export async function loggerMiddleware(request: FastifyRequest, _reply: FastifyReply) {
  request.log.info({ reqId: request.id, method: request.method, url: request.url }, 'incoming request');
}
