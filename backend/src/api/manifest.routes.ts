import { FastifyPluginAsync } from 'fastify';
import { routeManifest } from './routes.manifest.js';

const manifestRoutes: FastifyPluginAsync = async (app) => {
  app.get('/routes/manifest', async () => routeManifest);
};

export default manifestRoutes;
