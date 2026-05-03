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
  },
  stats: async () => {
    const q = await initQueue();
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      q.getWaitingCount(),
      q.getActiveCount(),
      q.getCompletedCount(),
      q.getFailedCount(),
      q.getDelayedCount()
    ]);
    return { waiting, active, completed, failed, delayed };
  },
  dlq: async (limit = 50) => {
    const q = await initQueue();
    const jobs = await q.getFailed(0, limit - 1);
    return jobs.map((j: any) => ({ id: j.id, name: j.name, failedReason: j.failedReason, attemptsMade: j.attemptsMade, timestamp: j.timestamp }));
  }
};
