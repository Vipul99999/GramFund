import test from 'node:test';
import assert from 'node:assert/strict';
import { requireDoubleEntry, requireDistinctFamilies, requirePositiveAmount } from '../src/core/invariants.js';

test('double entry requires debit and credit parity', () => {
  assert.equal(requireDoubleEntry([{ side: 'DEBIT', amount: 10 }, { side: 'CREDIT', amount: 10 }]).ok, true);
  assert.equal(requireDoubleEntry([{ side: 'DEBIT', amount: 10 }, { side: 'CREDIT', amount: 9 }]).ok, false);
});

test('distinct families and positive amount', () => {
  assert.equal(requireDistinctFamilies('a', 'b').ok, true);
  assert.equal(requireDistinctFamilies('a', 'a').ok, false);
  assert.equal(requirePositiveAmount(1).ok, true);
  assert.equal(requirePositiveAmount(0).ok, false);
});
