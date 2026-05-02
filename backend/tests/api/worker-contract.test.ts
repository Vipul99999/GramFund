import test from 'node:test';
import assert from 'node:assert/strict';
import { jobContracts } from '../../src/jobs/contracts.js';

test('worker contract keys are stable and required jobs exist', () => {
  assert.ok(jobContracts['notification.send']);
  assert.ok(jobContracts['ledger.reconcile']);
  assert.ok(jobContracts['retry.failed']);
});
