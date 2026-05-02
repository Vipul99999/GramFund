import { create } from 'zustand';
import { SyncConflict } from '../types/common.types';

export const useConflictStore = create<{ conflicts: SyncConflict[]; setConflicts: (c: SyncConflict[]) => void }>((set) => ({
  conflicts: [],
  setConflicts: (conflicts) => set({ conflicts })
}));
