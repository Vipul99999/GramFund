import fp from 'fastify-plugin';

export default fp(async (app) => {
  app.decorate('canAccessVillage', (_userId: string, _villageId: string) => true);
});
