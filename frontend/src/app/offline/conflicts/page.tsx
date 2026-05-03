'use client';
import { useConflictStore } from '../../../store/conflict.store';

export default function OfflineConflictsPage() {
  const conflicts = useConflictStore((s) => s.conflicts);
  return <main><h1>Sync Conflicts</h1>{conflicts.length === 0 ? <p>No conflicts</p> : conflicts.map((c) => <p key={c.actionId}>{c.type}: {c.message}</p>)}</main>;
}
