import { requireDistinctFamilies, requireIdempotencyKey, requirePositiveAmount } from '../../../core/invariants.js';

export class TransactionRulesService {
  validate(input: { fromFamilyId: string; toFamilyId: string; amount: number; idempotencyKey?: string }) {
    const checks = [
      requireDistinctFamilies(input.fromFamilyId, input.toFamilyId),
      requirePositiveAmount(input.amount),
      requireIdempotencyKey(input.idempotencyKey)
    ];
    const failed = checks.find((c) => !c.ok);
    if (failed) throw new Error(failed.reason);
    return true;
  }
}
