import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../../src/app.js';

test('trust visibility routes create confirmations and compute handler pending', async () => {
  const app = buildApp();
  const created = await app.inject({
    method: 'POST',
    url: '/api/v1/payments/confirmations',
    payload: { transactionId: 'tx_1', side: 'PAYER', channel: 'SMS', confirmed: true }
  });
  assert.equal(created.statusCode, 200);

  const list = await app.inject({ method: 'GET', url: '/api/v1/payments/confirmations' });
  assert.equal(list.statusCode, 200);

  await app.inject({ method: 'POST', url: '/api/v1/handlers/h1/ledger', payload: { collected: 1000 } });
  const transparency = await app.inject({ method: 'GET', url: '/api/v1/handlers/h1/transparency' });
  const body = transparency.json();
  assert.equal(body.pendingAmount, 1000);
  assert.equal(body.riskSignal, 'PENDING_SETTLEMENT');
});
