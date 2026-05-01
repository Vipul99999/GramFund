import { getQueue, updateQueue } from './queue';
import { resolveConflict } from './conflicts/resolver';
import { SyncConflict } from '../types/common.types';

async function sendAction(action: { id: string; type: string; payload: unknown; idempotencyKey: string }) {
  return fetch('/api/v1/sync', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(action) });
}

export async function syncOfflineQueue() {
  if (!navigator.onLine) return { synced: 0, conflicts: [] as SyncConflict[] };

  const queue = await getQueue();
  const conflicts: SyncConflict[] = [];
  const remaining = [];
  let synced = 0;

  for (const action of queue) {
    try {
      const res = await sendAction(action);
      if (res.ok) { synced += 1; continue; }
      if (res.status === 409) {
        const conflict: SyncConflict = { actionId: action.id, type: 'DUPLICATE', message: 'Duplicate action on server' };
        if (resolveConflict(conflict) === 'CLIENT_WINS') remaining.push({ ...action, retries: action.retries + 1 });
        conflicts.push(conflict);
        continue;
      }
      remaining.push({ ...action, retries: action.retries + 1 });
    } catch {
      remaining.push({ ...action, retries: action.retries + 1 });
    }
  }

  await updateQueue(remaining);
  return { synced, conflicts };
}
