import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../../src/app.js';

test('dynamic auth login supports phone otp and email password', async () => {
  const app = buildApp();
  await app.ready();

  const signup = await app.inject({ method: 'POST', url: '/api/v1/auth/signup-email', payload: { email: 'a@test.com', password: 'pass123' } });
  assert.equal(signup.statusCode, 200);

  const emailLogin = await app.inject({ method: 'POST', url: '/api/v1/auth/login', payload: { identifier: 'a@test.com', password: 'pass123', deviceId: 'dev-1' } });
  assert.equal(emailLogin.statusCode, 200);

  const issue = await app.inject({ method: 'POST', url: '/api/v1/auth/login', payload: { identifier: '+10000000000', deviceId: 'dev-1' } });
  assert.equal(issue.statusCode, 200);

  await app.close();
});
