import { prisma } from '../../../lib/prisma.js';

export interface OverpaymentCreditRecord {
  familyId: string;
  eventId?: string;
  amount: number;
  consumed?: number;
  note?: string;
}

export class OverpaymentCreditService {
  async createCredit(record: OverpaymentCreditRecord) {
    const normalized = { ...record, consumed: record.consumed ?? 0 };
    await prisma.overpaymentCredit.create({
      data: {
        familyId: record.familyId,
        eventId: record.eventId,
        amount: record.amount,
        consumed: normalized.consumed,
        note: record.note
      } as any
    });
    return normalized;
  }

  async getAvailableCredit(familyId: string) {
    const rows = await prisma.overpaymentCredit.findMany({ where: { familyId } } as any);
    return (rows as any[])
      .reduce((sum, c) => sum + (Number(c.amount) - Number(c.consumed ?? 0)), 0);
  }
}
