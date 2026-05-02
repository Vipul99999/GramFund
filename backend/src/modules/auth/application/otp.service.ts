import crypto from 'node:crypto';

type OtpRecord = { phone: string; hash: string; expiresAt: number; attempts: number; used: boolean };
const otpStore = new Map<string, OtpRecord>();

export class OtpService {
  issue(phone: string) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const hash = crypto.createHash('sha256').update(code).digest('hex');
    otpStore.set(phone, { phone, hash, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0, used: false });
    return { code }; // in production send SMS only
  }

  verify(phone: string, code: string) {
    const rec = otpStore.get(phone);
    if (!rec) throw new Error('OTP not found');
    if (rec.used) throw new Error('OTP already used');
    if (rec.expiresAt < Date.now()) throw new Error('OTP expired');
    if (rec.attempts >= 5) throw new Error('OTP attempts exceeded');
    rec.attempts += 1;
    const hash = crypto.createHash('sha256').update(code).digest('hex');
    if (hash !== rec.hash) throw new Error('OTP invalid');
    rec.used = true;
    return true;
  }
}
