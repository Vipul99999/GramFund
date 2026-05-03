import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../../src/app.js';

test('compliance routes perform kyc, sanctions and case creation', async () => {
  const app = buildApp();
  await app.ready();
  const kyc = await app.inject({ method: 'POST', url: '/api/v1/compliance/kyc/check', payload: { userId: 'u1', documentVerified: true } });
  assert.equal(kyc.statusCode, 200);

  const sanctions = await app.inject({ method: 'POST', url: '/api/v1/compliance/sanctions/screen', payload: { subject: 'sanctioned-entity' } });
  assert.equal(sanctions.statusCode, 200);

  const c = await app.inject({ method: 'POST', url: '/api/v1/compliance/cases', payload: { subject: 'u1', reason: 'suspicious velocity' } });
  assert.equal(c.statusCode, 200);
  await app.close();
});
