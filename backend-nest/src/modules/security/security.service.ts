import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CryptoService } from '../../infrastructure/security/crypto.service';

@Injectable()
export class SecurityService {
  constructor(private readonly prisma: PrismaService, private readonly crypto: CryptoService) {}

  async encryptFamilyPhones() {
    const profiles = await this.prisma.familyProfile.findMany({ where: { phone: { not: null } } });
    for (const p of profiles) {
      if (!p.phone) continue;
      const encrypted = this.crypto.encrypt(p.phone);
      await this.prisma.familyProfile.update({ where: { id: p.id }, data: { phone: encrypted } });
      await this.prisma.auditLog.create({ data: { actorUserId: 'system', action: 'PII_PHONE_ENCRYPTED', entityType: 'FamilyProfile', entityId: p.id } });
    }
    return { encryptedCount: profiles.length };
  }

  async auditSecretsPolicy() {
    const required = ['PII_ENCRYPTION_KEY', 'RECEIPT_SIGNING_KEY', 'NOTIFICATION_WEBHOOK_SECRET', 'JWT_SECRET'];
    const missing = required.filter((k) => !process.env[k]);
    return { ok: missing.length === 0, missing };
  }

  async zeroTrustAccessAudit() {
    const recentFailures = await this.prisma.auditLog.count({ where: { action: 'LEGAL_ACCEPTANCE_CHECK_FAIL', createdAt: { gte: new Date(Date.now() - 24*3600*1000) } } });
    return { windowHours: 24, legalAccessFailures: recentFailures, posture: recentFailures > 20 ? 'ELEVATED_RISK' : 'NORMAL' };
  }
}
