import 'dotenv/config';

export const workerEnv = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  WORKER_CONCURRENCY: Number(process.env.WORKER_CONCURRENCY ?? 5)
};
