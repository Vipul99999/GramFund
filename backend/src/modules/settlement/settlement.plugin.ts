import { FastifyPluginAsync } from 'fastify';

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/settlement', async () => ({ module: 'settlement', status: 'ok' }));
};

export default plugin;
