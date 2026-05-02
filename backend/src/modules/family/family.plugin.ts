import { FastifyPluginAsync } from 'fastify';

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/family', async () => ({ module: 'family', status: 'ok' }));
};

export default plugin;
