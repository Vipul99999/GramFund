import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class FraudPreventionService {
  constructor(private readonly prisma: PrismaService) {}

  async runDetectors() {
    const alerts: string[] = [];
    const highPending = await this.prisma.settlement.findMany({ where: { pendingAmount: { gt: 50000 as any } } });
    for (const s of highPending) {
      await this.prisma.fraudAlert.create({ data: { type: 'HIGH_PENDING', severity: 'HIGH', subjectType: 'Settlement', subjectId: s.id, message: 'High pending settlement amount' } });
      alerts.push(s.id);
    }
    const dupKeys = await this.prisma.transaction.groupBy({ by: ['idempotencyKey'], _count: { _all: true }, having: { idempotencyKey: { _count: { gt: 1 } } } as any });
    for (const d of dupKeys) {
      await this.prisma.fraudAlert.create({ data: { type: 'DUPLICATE_KEY_PATTERN', severity: 'CRITICAL', subjectType: 'Transaction', subjectId: d.idempotencyKey, message: 'Duplicate idempotency key pattern detected' } });
      alerts.push(d.idempotencyKey);
    }
    return { generatedAlerts: alerts.length };
  }
}
