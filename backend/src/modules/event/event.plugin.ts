import { FastifyPluginAsync } from 'fastify';

const plugin: FastifyPluginAsync = async (app) => {
  app.get('/event', async () => ({ module: 'event', status: 'ok' }));
};

export default plugin;
