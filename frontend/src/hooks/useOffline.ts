'use client';
import { addToQueue } from '../offline/queue';

export const useOffline = () => ({
  enqueueOffline: async (type: string, payload: unknown, idempotencyKey: string) => addToQueue({
    id: `${Date.now()}`,
    type,
    payload,
    idempotencyKey,
    retries: 0,
    createdAt: Date.now()
  })
});
