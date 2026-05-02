import test from 'node:test';
import assert from 'node:assert/strict';
import { OverpaymentCreditService } from '../src/modules/payment/application/overpayment-credit.service.js';
import { FamilySplitMergeService } from '../src/modules/family/application/family-split-merge.service.js';
import { ReminderService } from '../src/modules/payment/application/reminder.service.js';

test('overpayment credit tracks available balance', async () => {
  const svc = new OverpaymentCreditService();
  await svc.createCredit({ familyId: 'f1', amount: 150, consumed: 40 });
  assert.equal(await svc.getAvailableCredit('f1'), 110);
});

test('family split merge record can be queried by family', async () => {
  const svc = new FamilySplitMergeService();
  await svc.record({ sourceFamilyId: 'f1', targetFamilyId: 'f2', operation: 'SPLIT' });
  assert.equal((await svc.listByFamily('f1')).length, 1);
});

test('reminder service lists due tasks', () => {
  const svc = new ReminderService();
  svc.enqueue({ familyId: 'f1', reason: 'pending commitment', dueAt: new Date('2026-01-01T00:00:00Z') });
  assert.equal(svc.listPending(new Date('2026-01-02T00:00:00Z')).length, 1);
});
