import { FastifyReply, FastifyRequest } from 'fastify';
import { Action, PolicyContext, PolicyResource, PolicyUser } from '../abac/types.js';
import { can } from '../abac/policies.js';

export const abacMiddleware = (action: Action, resourceResolver?: (request: FastifyRequest) => PolicyResource, contextResolver?: (request: FastifyRequest) => PolicyContext) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as FastifyRequest & { user?: PolicyUser }).user;
    const resource = resourceResolver ? resourceResolver(request) : {};
    const context = contextResolver ? contextResolver(request) : {};

    if (!can(action, user, resource, context)) {
      return reply.code(403).send({ message: 'Forbidden by ABAC policy', action });
    }
  };
};
