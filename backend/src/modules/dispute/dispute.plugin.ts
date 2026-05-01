import { FastifyPluginAsync } from 'fastify';

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/dispute', async () => ({ module: 'dispute', status: 'ok' }));
};

export default plugin;
