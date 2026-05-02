import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../../src/app.js';

test('sync accepts first action and rejects duplicate idempotency', async () => {
  const app = buildApp();
  await app.ready();

  const payload = { id: 'action-1', type: 'PAYMENT_CREATE', payload: { amount: 100 }, idempotencyKey: 'idem-123456789' };

  const first = await app.inject({ method: 'POST', url: '/api/v1/sync', payload });
  assert.equal(first.statusCode, 202);

  const duplicate = await app.inject({ method: 'POST', url: '/api/v1/sync', payload });
  assert.equal(duplicate.statusCode, 409);

  await app.close();
});
