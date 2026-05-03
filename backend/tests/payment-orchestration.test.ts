import test from 'node:test';
import assert from 'node:assert/strict';
import { PaymentOrchestrationService } from '../src/modules/payment/application/payment-orchestration.service.js';

test('payment orchestration posts transaction and ledger entries', async () => {
  const svc = new PaymentOrchestrationService();
  const res = await svc.processPayment({ fromFamilyId: 'f1', toFamilyId: 'f2', amount: 100, mode: 'CASH' });
  assert.equal(res.transaction.amount, 100);
  assert.equal(res.ledgerEntries.length, 2);
});
