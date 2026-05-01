import { FastifyRequest } from 'fastify';
import { can, Action, PolicyResource, PolicyContext, PolicyUser } from '../core/policies.js';
import { abacMiddleware } from './abac.middleware.js';

export const authorize = (action: Action, resourceResolver?: (request: FastifyRequest) => PolicyResource, contextResolver?: (request: FastifyRequest) => PolicyContext) =>
  abacMiddleware(action, resourceResolver, contextResolver);

export const evaluateAccess = (action: Action, user: PolicyUser, resource: PolicyResource = {}, context: PolicyContext = {}) => can(action, user, resource, context);
