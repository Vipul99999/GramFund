import { prisma } from '../../lib/prisma.js';
import { incMetric } from '../ops/metrics.js';

interface RiskInput { key: string; ip?: string; deviceId?: string }

async function getState(key: string) {
  return await prisma.riskState.findUnique({ where: { key } }) as any;
}

async function saveEvent(data: Record<string, unknown>) {
  await prisma.securityEvent.create({ data: { ...data, createdAt: Date.now() } });
}

export async function assessRisk(input: RiskInput) {
  const rec = await getState(input.key);
  const now = Date.now();
  if (rec?.lockUntil && Number(rec.lockUntil) > now) {
    incMetric('auth_lockout_block_total');
    await saveEvent({ type: 'AUTH_BLOCKED', key: input.key, ip: input.ip, deviceId: input.deviceId, reason: 'ACCOUNT_LOCKED' });
    return { blocked: true, reason: 'ACCOUNT_LOCKED' };
  }

  const suspicious = Boolean(!input.deviceId || (rec?.count && Number(rec.count) >= 3));
  await saveEvent({ type: 'AUTH_RISK_ASSESS', key: input.key, ip: input.ip, deviceId: input.deviceId, suspicious });
  return { blocked: false, suspicious, reason: suspicious ? 'SUSPICIOUS_PATTERN' : 'OK' };
}

export async function markFailure(key: string, ip?: string, deviceId?: string) {
  const rec = (await getState(key)) ?? { key, count: 0 };
  const count = Number(rec.count ?? 0) + 1;
  const lockUntil = count >= 5 ? Date.now() + 10 * 60 * 1000 : rec.lockUntil;
  await prisma.riskState.upsert({ where: { key }, create: { key, count, lockUntil }, update: { count, lockUntil } });
  incMetric('auth_failure_total');
  await saveEvent({ type: 'AUTH_FAILURE', key, ip, deviceId, count, lockUntil: lockUntil ?? null });
}

export async function resetFailures(key: string) {
  await prisma.riskState.upsert({ where: { key }, create: { key, count: 0, lockUntil: null }, update: { count: 0, lockUntil: null } });
  await saveEvent({ type: 'AUTH_RESET', key });
}
