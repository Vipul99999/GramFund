import { JobName } from '../jobs/contracts.js';
import { redisConfig } from '../config/redis.js';

let bullQueue: any;

export async function initQueue() {
  if (bullQueue) return bullQueue;
  const { Queue } = await import('bullmq');
  bullQueue = new Queue('gramfund-jobs', { connection: redisConfig });
  return bullQueue;
}

export const queue = {
  enqueue: async (name: JobName, payload: unknown, attempts = 5) => {
    const q = await initQueue();
    await q.add(name, payload, { attempts, backoff: { type: 'exponential', delay: 1000 }, removeOnComplete: 1000 });
    return { enqueued: true, name };
  }
};
