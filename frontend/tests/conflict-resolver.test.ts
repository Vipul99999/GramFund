import { describe, expect, it } from 'vitest';
import { resolveConflict } from '../src/offline/conflicts/resolver';

describe('resolveConflict', () => {
  it('returns SERVER_WINS for duplicate conflicts', () => {
    expect(resolveConflict({ actionId: 'a1', type: 'DUPLICATE', message: 'dup' })).toBe('SERVER_WINS');
  });

  it('returns CLIENT_WINS for network timeout', () => {
    expect(resolveConflict({ actionId: 'a1', type: 'NETWORK_TIMEOUT', message: 'timeout' })).toBe('CLIENT_WINS');
  });
});
