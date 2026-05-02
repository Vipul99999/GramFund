import { FastifyPluginAsync } from 'fastify';

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/transaction', async () => ({ module: 'transaction', status: 'ok' }));
};

export default plugin;
