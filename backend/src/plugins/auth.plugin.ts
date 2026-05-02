import fp from 'fastify-plugin';

export default fp(async (app) => {
  app.decorateRequest('user', null);
});
