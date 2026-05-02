import fp from 'fastify-plugin';

export default fp(async (app) => {
  app.decorate('cache', new Map<string, unknown>());
});
