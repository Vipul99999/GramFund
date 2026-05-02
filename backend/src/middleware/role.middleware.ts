import { FastifyReply, FastifyRequest } from 'fastify';

export const roleMiddleware = (roles: string[]) => async (request: FastifyRequest, reply: FastifyReply) => {
  const user = (request as FastifyRequest & { user?: { role?: string } }).user;
  if (!user?.role || !roles.includes(user.role)) {
    return reply.code(403).send({ message: 'Forbidden' });
  }
};
