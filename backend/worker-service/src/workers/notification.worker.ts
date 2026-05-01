import { NotificationJobPayload } from '../../../src/jobs/contracts.js';
import { NotificationService } from '../../../src/modules/notification/notification.service.js';
import { notificationMetrics } from './notification.metrics.js';
import { pushProvider, smsProvider } from './notification.providers.js';

const svc = new NotificationService();
const MAX_RETRIES = 3;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function retrySend(fn: () => Promise<{ ok: boolean; error?: string }>) {
  let lastError: string | undefined;
  for (let i = 1; i <= MAX_RETRIES; i += 1) {
    const res = await fn();
    if (res.ok) return { ok: true, retriesUsed: i - 1 };
    lastError = res.error;
    if (i < MAX_RETRIES) await sleep(100 * i);
  }
  return { ok: false, lastError, retriesUsed: MAX_RETRIES };
}

export const runNotificationWorker = async (payload: NotificationJobPayload) => {
  if (payload.priority === 'LOW') {
    notificationMetrics.inAppCount += 1;
    await svc.createDelivery({ notificationId: payload.notificationId, channel: 'IN_APP', status: 'SENT', retryCount: 0 });
    await svc.setFinalState(payload.notificationId, 'IN_APP', 0, payload);
    return;
  }

  const pushResult = await retrySend(() => pushProvider.send({ userId: payload.userId, to: payload.to, message: payload.message }));
  if (pushResult.ok) {
    notificationMetrics.pushSuccess += 1;
    await svc.createDelivery({ notificationId: payload.notificationId, channel: 'PUSH', status: 'SENT', retryCount: pushResult.retriesUsed });
    await svc.setFinalState(payload.notificationId, 'PUSH', pushResult.retriesUsed, { ...payload, channelsTried: [...payload.channelsTried, 'PUSH'], finalChannel: 'PUSH' });
    return;
  }

  notificationMetrics.pushFail += 1;
  notificationMetrics.fallbackCount += 1;
  await svc.createDelivery({ notificationId: payload.notificationId, channel: 'PUSH', status: 'FAILED', retryCount: pushResult.retriesUsed, error: pushResult.lastError });

  if (payload.priority === 'IMPORTANT') {
    notificationMetrics.manualQueueSize += 1;
    await svc.setFinalState(payload.notificationId, 'MANUAL', pushResult.retriesUsed, { ...payload, channelsTried: [...payload.channelsTried, 'PUSH', 'MANUAL'], finalChannel: 'MANUAL' }, pushResult.lastError);
    return;
  }

  const smsResult = await retrySend(() => smsProvider.send({ to: payload.to, message: payload.message }));
  if (smsResult.ok) {
    notificationMetrics.smsSuccess += 1;
    await svc.createDelivery({ notificationId: payload.notificationId, channel: 'SMS', status: 'SENT', retryCount: smsResult.retriesUsed });
    await svc.setFinalState(payload.notificationId, 'SMS', smsResult.retriesUsed, { ...payload, channelsTried: [...payload.channelsTried, 'PUSH', 'SMS'], finalChannel: 'SMS' });
    return;
  }

  notificationMetrics.smsFail += 1;
  notificationMetrics.manualQueueSize += 1;
  await svc.createDelivery({ notificationId: payload.notificationId, channel: 'SMS', status: 'FAILED', retryCount: smsResult.retriesUsed, error: smsResult.lastError });
  await svc.setFinalState(payload.notificationId, 'MANUAL', smsResult.retriesUsed, { ...payload, channelsTried: [...payload.channelsTried, 'PUSH', 'SMS', 'MANUAL'], finalChannel: 'MANUAL' }, smsResult.lastError ?? pushResult.lastError);
};
