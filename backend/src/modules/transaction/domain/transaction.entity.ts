export type TransactionStatus = 'INITIATED' | 'CONFIRMED' | 'FAILED' | 'REVERSED';

export interface TransactionEntity {
  id: string;
  fromFamilyId: string;
  toFamilyId: string;
  amount: number;
  status: TransactionStatus;
  idempotencyKey: string;
}

export const validateTransactionEntity = (tx: TransactionEntity) => tx.amount > 0 && tx.fromFamilyId !== tx.toFamilyId;
