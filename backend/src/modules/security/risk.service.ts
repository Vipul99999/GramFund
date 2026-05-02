interface RiskInput { key: string; ip?: string; deviceId?: string }
const failed = new Map<string, { count: number; lockUntil?: number }>();

export function assessRisk(input: RiskInput) {
  const rec = failed.get(input.key);
  const now = Date.now();
  if (rec?.lockUntil && rec.lockUntil > now) return { blocked: true, reason: 'ACCOUNT_LOCKED' };

  const suspicious = Boolean(!input.deviceId || rec?.count && rec.count >= 3);
  return { blocked: false, suspicious, reason: suspicious ? 'SUSPICIOUS_PATTERN' : 'OK' };
}

export function markFailure(key: string) {
  const rec = failed.get(key) ?? { count: 0 };
  rec.count += 1;
  if (rec.count >= 5) rec.lockUntil = Date.now() + 10 * 60 * 1000;
  failed.set(key, rec);
}

export function resetFailures(key: string) { failed.delete(key); }
