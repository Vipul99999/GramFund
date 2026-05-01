import { create } from 'zustand';

type OfflineState = { queue: unknown[]; setQueue: (queue: unknown[]) => void };
export const useOfflineStore = create<OfflineState>((set) => ({ queue: [], setQueue: (queue) => set({ queue }) }));
