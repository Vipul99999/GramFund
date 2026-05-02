import test from 'node:test';
import assert from 'node:assert/strict';
import { runNotificationWorker } from './notification.worker.js';
import { prisma } from '../../../src/lib/prisma.js';

test('important notification falls back to manual when push fails', async () => {
  const id = 'n-worker-1';
  await prisma.notification.create({ data: { id, userId: 'u1', channel: 'IN_APP', priority: 'IMPORTANT', status: 'PENDING', message: 'm', createdAt: new Date().toISOString(), sentAt: null, readAt: null, metadata: {} } });
  await runNotificationWorker({ notificationId: id, userId: 'u1', to: 'fail-push-user', message: 'hello', priority: 'IMPORTANT', attempt: 1, channelsTried: ['IN_APP'] });
  const updated: any = await prisma.notification.findUnique({ where: { id } });
  assert.equal(updated?.status, 'NEEDS_MANUAL');
});
