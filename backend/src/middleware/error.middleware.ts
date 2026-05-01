import { FastifyInstance } from 'fastify';

export const registerErrorHandler = (app: FastifyInstance) => {
  app.setErrorHandler((error, _request, reply) => {
    reply.code(500).send({ message: error.message || 'Internal server error' });
  });
};
