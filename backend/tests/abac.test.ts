import test from 'node:test';
import assert from 'node:assert/strict';
import { can } from '../src/abac/policies.js';

test('handler can view same-address family only', () => {
  const user = { id: 'u1', role: 'HANDLER' as const, isActive: true, addressId: 'a1' };
  assert.equal(can('family.view', user, { addressId: 'a1' }, {}), true);
  assert.equal(can('family.view', user, { addressId: 'a2' }, {}), false);
});
