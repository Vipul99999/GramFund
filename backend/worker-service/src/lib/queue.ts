import { redisConfig } from '../../../src/config/redis.js';

let workerRef: any;

export const startWorker = async (processor: Record<string, (payload: unknown) => Promise<void>>) => {
  const { Worker } = await import('bullmq');
  workerRef = new Worker('gramfund-jobs', async (job: any) => {
    const handler = processor[job.name];
    if (!handler) throw new Error(`Missing handler for ${job.name}`);
    await handler(job.data);
  }, { connection: redisConfig });
  return workerRef;
};
