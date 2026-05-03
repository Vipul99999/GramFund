import { buildIdempotencyKey } from '../../../utils/idempotency.js';
import { applyLedgerEntry } from '../../../utils/ledger/index.js';
import { TransactionEntity, validateTransactionEntity } from '../domain/transaction.entity.js';
import { TransactionRepository } from '../infra/transaction.repository.js';
import { TransactionRulesService } from './transaction-rules.service.js';

export class TransactionService {
  constructor(private readonly repo = new TransactionRepository(), private readonly rules = new TransactionRulesService()) {}

  async create(input: Omit<TransactionEntity, 'id' | 'status' | 'idempotencyKey'>): Promise<TransactionEntity> {
    const tx: TransactionEntity = {
      id: `txn_${Date.now()}`,
      status: 'CONFIRMED',
      idempotencyKey: buildIdempotencyKey(`${input.fromFamilyId}:${input.toFamilyId}:${input.amount}`),
      ...input
    };

    this.rules.validate({ fromFamilyId: tx.fromFamilyId, toFamilyId: tx.toFamilyId, amount: tx.amount, idempotencyKey: tx.idempotencyKey });
    if (!validateTransactionEntity(tx)) throw new Error('Invalid transaction');

    // orchestration placeholder: post double entry
    applyLedgerEntry({ totalGiven: 0, totalReceived: 0 }, tx.amount, 'given');
    applyLedgerEntry({ totalGiven: 0, totalReceived: 0 }, tx.amount, 'received');

    return this.repo.create(tx);
  }
}
