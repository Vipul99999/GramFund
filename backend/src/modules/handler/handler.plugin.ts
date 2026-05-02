import { FastifyPluginAsync } from 'fastify';

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/handler', async () => ({ module: 'handler', status: 'ok' }));
};

export default plugin;
