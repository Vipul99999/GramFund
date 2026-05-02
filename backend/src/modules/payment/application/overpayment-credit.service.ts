export interface OverpaymentCreditRecord {
  familyId: string;
  eventId?: string;
  amount: number;
  consumed?: number;
  note?: string;
}

export class OverpaymentCreditService {
  private readonly credits: OverpaymentCreditRecord[] = [];

  createCredit(record: OverpaymentCreditRecord) {
    const normalized = { ...record, consumed: record.consumed ?? 0 };
    this.credits.push(normalized);
    return normalized;
  }

  getAvailableCredit(familyId: string) {
    return this.credits
      .filter((c) => c.familyId === familyId)
      .reduce((sum, c) => sum + (c.amount - (c.consumed ?? 0)), 0);
  }
}
