import test from 'node:test';
import assert from 'node:assert/strict';
import { issueTokenPair, verifyToken } from '../../src/modules/security/token.service.js';

test('issues and verifies access/refresh tokens', () => {
  const pair = issueTokenPair('user-1', 'session-1');
  const access = verifyToken(pair.accessToken, 'access');
  const refresh = verifyToken(pair.refreshToken, 'refresh');
  assert.equal(access.sub, 'user-1');
  assert.equal(refresh.sid, 'session-1');
});
