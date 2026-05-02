import crypto from 'node:crypto';
import { prisma } from '../../../lib/prisma.js';
import { env } from '../../../config/env.js';
import { routeNotification } from '../../notification/notification-policy.service.js';
import { incMetric } from '../../ops/metrics.js';

const dayKey = () => new Date().toISOString().slice(0, 10);

async function bumpQuota(key: string) {
  const existing = await prisma.quotaUsage.findUnique({ where: { key } });
  if (existing) {
    const count = Number(existing.count ?? 0) + 1;
    await prisma.quotaUsage.update({ where: { key }, data: { count } });
    return count;
  }
  await prisma.quotaUsage.create({ data: { key, count: 1 } });
  return 1;
}

export class OtpService {
  async issue(phone: string, villageId = 'global') {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const hash = crypto.createHash('sha256').update(code).digest('hex');

    const globalCount = await bumpQuota(`otp:global:${dayKey()}`);
    const userCount = await bumpQuota(`otp:user:${phone}:${dayKey()}`);
    const villageCount = await bumpQuota(`otp:village:${villageId}:${dayKey()}`);

    if (globalCount > env.OTP_DAILY_CAP) throw new Error('OTP daily cap reached');
    if (userCount > env.OTP_PER_USER_DAILY_CAP) throw new Error('OTP user cap reached');
    if (villageCount > env.OTP_PER_VILLAGE_DAILY_CAP) throw new Error('OTP village cap reached');

    await prisma.otpRecord.upsert({
      where: { phone },
      create: { phone, hash, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0, used: false },
      update: { hash, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0, used: false }
    });

    await routeNotification({
      userKey: phone,
      villageId,
      priority: 'CRITICAL',
      channels: ['PUSH', 'SMS'],
      purpose: 'OTP',
      message: 'Your OTP is issued'
    });

    incMetric('otp_issued_total');
    return { code }; // in production send SMS provider payload only
  }

  async verify(phone: string, code: string) {
    const rec = await prisma.otpRecord.findUnique({ where: { phone } }) as any;
    if (!rec) throw new Error('OTP not found');
    if (rec.used) throw new Error('OTP already used');
    if (Number(rec.expiresAt) < Date.now()) throw new Error('OTP expired');
    if (Number(rec.attempts) >= 5) throw new Error('OTP attempts exceeded');

    const nextAttempts = Number(rec.attempts) + 1;
    await prisma.otpRecord.update({ where: { phone }, data: { attempts: nextAttempts } });

    const hash = crypto.createHash('sha256').update(code).digest('hex');
    if (hash !== rec.hash) {
      incMetric('otp_verify_failed_total');
      throw new Error('OTP invalid');
    }

    await prisma.otpRecord.update({ where: { phone }, data: { used: true } });
    incMetric('otp_verify_success_total');
    return true;
  }
}
