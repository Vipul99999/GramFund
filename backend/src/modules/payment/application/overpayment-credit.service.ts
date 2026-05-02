import { prisma } from '../../../lib/prisma.js';

export interface OverpaymentCreditRecord {
  familyId: string;
  eventId?: string;
  amount: number;
  consumed?: number;
  note?: string;
}

const ENTITY = 'OVERPAYMENT_CREDIT';

export class OverpaymentCreditService {
  async createCredit(record: OverpaymentCreditRecord) {
    const normalized = { ...record, consumed: record.consumed ?? 0 };
    await prisma.auditLog.create({
      data: {
        entity: ENTITY,
        entityId: `${record.familyId}:${record.eventId ?? 'general'}:${Date.now()}`,
        action: 'CREDIT_CREATE',
        data: normalized,
        createdAt: new Date()
      } as any
    });
    return normalized;
  }

  async getAvailableCredit(familyId: string) {
    const logs = await prisma.auditLog.findMany({ where: { entity: ENTITY } } as any);
    return (logs as any[])
      .map((l) => l.data as OverpaymentCreditRecord)
      .filter((c) => c.familyId === familyId)
      .reduce((sum, c) => sum + (c.amount - (c.consumed ?? 0)), 0);
  }
}
