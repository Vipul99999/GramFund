import test from 'node:test';
import assert from 'node:assert/strict';
import { NotificationService } from '../src/modules/notification/notification.service.js';
import { runNotificationWorker } from '../worker-service/src/workers/notification.worker.js';
import { prisma } from '../src/lib/prisma.js';

test('LOW uses in-app only', async () => {
  const svc = new NotificationService();
  const n: any = await svc.create({ userId: 'u1', to: 'ok', message: 'm', priority: 'LOW' });
  await runNotificationWorker({ notificationId: n.id, userId: 'u1', to: 'ok', message: 'm', priority: 'LOW', attempt: 1, channelsTried: ['IN_APP'] });
  const updated: any = await prisma.notification.findUnique({ where: { id: n.id } });
  assert.equal(updated.channel, 'IN_APP');
});

test('CRITICAL push fail then sms success', async () => {
  const svc = new NotificationService();
  const n: any = await svc.create({ userId: 'u2', to: 'fail-push-ok-sms', message: 'm', priority: 'CRITICAL' });
  await runNotificationWorker({ notificationId: n.id, userId: 'u2', to: 'fail-push-ok-sms', message: 'm', priority: 'CRITICAL', attempt: 1, channelsTried: ['IN_APP'] });
  const updated: any = await prisma.notification.findUnique({ where: { id: n.id } });
  assert.equal(updated.channel, 'SMS');
});

test('CRITICAL both fail -> manual', async () => {
  const svc = new NotificationService();
  const n: any = await svc.create({ userId: 'u3', to: 'fail-push-fail-sms', message: 'm', priority: 'CRITICAL' });
  await runNotificationWorker({ notificationId: n.id, userId: 'u3', to: 'fail-push-fail-sms', message: 'm', priority: 'CRITICAL', attempt: 1, channelsTried: ['IN_APP'] });
  const updated: any = await prisma.notification.findUnique({ where: { id: n.id } });
  assert.equal(updated.status, 'NEEDS_MANUAL');
});
