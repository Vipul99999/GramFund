import { FastifyPluginAsync } from 'fastify';

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/payment', async () => ({ module: 'payment', status: 'ok' }));
};

export default plugin;
