import { requireDoubleEntry } from '../../../core/invariants.js';

export interface LedgerPostingInput {
  fromFamilyId: string;
  toFamilyId: string;
  amount: number;
  transactionId: string;
}

export interface LedgerEntry {
  familyId: string;
  side: 'DEBIT' | 'CREDIT';
  amount: number;
  transactionId: string;
}

export class LedgerService {
  postDoubleEntry(input: LedgerPostingInput): LedgerEntry[] {
    if (input.amount <= 0) throw new Error('Amount must be positive');
    const entries = [
      { familyId: input.fromFamilyId, side: 'DEBIT' as const, amount: input.amount, transactionId: input.transactionId },
      { familyId: input.toFamilyId, side: 'CREDIT' as const, amount: input.amount, transactionId: input.transactionId }
    ];
    const check = requireDoubleEntry(entries);
    if (!check.ok) throw new Error(check.reason);
    return entries;
  }

  calculateNetBalance(totalReceived: number, totalGiven: number): number {
    return totalReceived - totalGiven;
  }
}
