import { OfflineAction } from '../types/common.types';
import { clearActions, listActions, saveAction } from './db';

export const addToQueue = async (action: OfflineAction) => saveAction(action);
export const getQueue = async () => listActions();
export const clearQueue = async () => clearActions();
export const updateQueue = async (next: OfflineAction[]) => {
  await clearActions();
  for (const action of next) await saveAction(action);
};
