import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../../src/app.js';

test('concurrent sync requests with same idempotency key should not both succeed', async () => {
  const app = buildApp();
  await app.ready();

  const payload = { id: 'race-1', type: 'PAYMENT_CREATE', payload: { amount: 100 }, idempotencyKey: 'idem-race-123456789' };
  const [a, b] = await Promise.all([
    app.inject({ method: 'POST', url: '/api/v1/sync', payload }),
    app.inject({ method: 'POST', url: '/api/v1/sync', payload })
  ]);

  const statuses = [a.statusCode, b.statusCode].sort();
  assert.deepEqual(statuses, [202, 409]);

  await app.close();
});
