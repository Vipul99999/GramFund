import { FastifyPluginAsync } from 'fastify';

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/report', async () => ({ module: 'report', status: 'ok' }));
};

export default plugin;
