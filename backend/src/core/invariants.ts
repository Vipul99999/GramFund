export interface InvariantResult { ok: boolean; reason?: string }

export const requireIdempotencyKey = (key?: string): InvariantResult =>
  key && key.length > 8 ? { ok: true } : { ok: false, reason: 'Missing or weak idempotency key' };

export const requirePositiveAmount = (amount: number): InvariantResult =>
  amount > 0 ? { ok: true } : { ok: false, reason: 'Amount must be positive' };

export const requireDistinctFamilies = (fromFamilyId: string, toFamilyId: string): InvariantResult =>
  fromFamilyId !== toFamilyId ? { ok: true } : { ok: false, reason: 'Self transfer blocked' };

export const requireDoubleEntry = (entries: Array<{ side: 'DEBIT' | 'CREDIT'; amount: number }>): InvariantResult => {
  if (entries.length !== 2) return { ok: false, reason: 'Ledger entries must be exactly two' };
  const debit = entries.find((e) => e.side === 'DEBIT');
  const credit = entries.find((e) => e.side === 'CREDIT');
  if (!debit || !credit) return { ok: false, reason: 'Missing debit/credit pair' };
  if (debit.amount !== credit.amount) return { ok: false, reason: 'Debit/credit mismatch' };
  return { ok: true };
};
