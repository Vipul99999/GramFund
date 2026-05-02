import { buildApp } from './app.js';
import { env } from './config/env.js';

const start = async () => {
  const app = buildApp();
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
};

start();
