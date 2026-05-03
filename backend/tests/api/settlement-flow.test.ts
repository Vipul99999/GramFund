import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../../src/app.js';

test('settlement tracks partial delivery and receiver confirmation', async () => {
  const app = await buildApp();

  const created = await app.inject({
    method: 'POST',
    url: '/api/v1/settlements',
    payload: { eventId: 'ev1', handlerId: 'h1', totalCollected: 1000, handlerCommission: 100 }
  });
  assert.equal(created.statusCode, 200);
  const settlement = created.json() as { id: string };

  const partial = await app.inject({
    method: 'POST',
    url: `/api/v1/settlements/${settlement.id}/deliver`,
    payload: { amount: 400 }
  });
  assert.equal(partial.statusCode, 200);
  assert.equal(partial.json().status, 'PARTIAL');

  const pending = await app.inject({ method: 'GET', url: '/api/v1/settlements/handler/h1/pending' });
  assert.equal(pending.statusCode, 200);
  assert.equal(pending.json().summary.pendingCount, 1);

  const confirmed = await app.inject({
    method: 'POST',
    url: `/api/v1/settlements/${settlement.id}/confirm`,
    payload: { confirmed: false, note: 'amount mismatch' }
  });
  assert.equal(confirmed.statusCode, 200);
  assert.equal(confirmed.json().status, 'DISPUTED');
});
