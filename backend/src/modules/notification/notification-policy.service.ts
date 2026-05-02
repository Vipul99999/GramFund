import { prisma } from '../../lib/prisma.js';
import { incMetric } from '../ops/metrics.js';

type Channel = 'PUSH' | 'SMS' | 'EMAIL' | 'MANUAL';
type Priority = 'LOW' | 'IMPORTANT' | 'CRITICAL';

interface RouteInput {
  userKey: string;
  villageId: string;
  purpose: string;
  message: string;
  priority: Priority;
  channels: Channel[];
}

const day = () => new Date().toISOString().slice(0, 10);

async function getUsage(key: string) {
  const row = await prisma.quotaUsage.findUnique({ where: { key } });
  return Number(row?.count ?? 0);
}

async function bump(key: string) {
  const current = await getUsage(key);
  const next = current + 1;
  if (current === 0) await prisma.quotaUsage.create({ data: { key, count: next } });
  else await prisma.quotaUsage.update({ where: { key }, data: { count: next } });
}

export async function routeNotification(input: RouteInput) {
  const smsGlobal = await getUsage(`sms:global:${day()}`);
  const smsVillage = await getUsage(`sms:village:${input.villageId}:${day()}`);

  let selected: Channel = 'PUSH';
  if (input.priority === 'CRITICAL' || input.channels.includes('SMS')) {
    if (smsGlobal < 500 && smsVillage < 200) selected = 'SMS';
    else selected = input.channels.includes('PUSH') ? 'PUSH' : 'MANUAL';
  }

  if (selected === 'SMS') {
    await bump(`sms:global:${day()}`);
    await bump(`sms:village:${input.villageId}:${day()}`);
    incMetric('sms_sent_total');
  } else {
    incMetric('push_sent_total');
  }

  const log = await prisma.notificationLog.create({
    data: {
      userKey: input.userKey,
      villageId: input.villageId,
      purpose: input.purpose,
      message: input.message,
      selected,
      createdAt: Date.now()
    }
  });

  return { selected, id: (log as any).id ?? `${Date.now()}` };
}
