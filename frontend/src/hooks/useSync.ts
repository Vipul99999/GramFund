'use client';
import { syncOfflineQueue } from '../offline/syncEngine';
import { useConflictStore } from '../store/conflict.store';

export const useSync = () => {
  const setConflicts = useConflictStore((s) => s.setConflicts);
  return {
    sync: async () => {
      const result = await syncOfflineQueue();
      setConflicts(result.conflicts);
      return result;
    }
  };
};
