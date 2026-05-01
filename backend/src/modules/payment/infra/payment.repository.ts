import { prisma } from '../../../lib/prisma.js';

export interface PaymentRecord {
  id: string;
  fromFamilyId: string;
  toFamilyId: string;
  amount: number;
  mode: 'CASH' | 'ONLINE';
  status: 'SUCCESS' | 'FAILED';
}

export class PaymentRepository {
  async create(record: PaymentRecord) {
    await prisma.payment.create({ data: record as unknown as Record<string, unknown> });
    return record;
  }
}
