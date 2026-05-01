export type ConflictType = 'VERSION_MISMATCH' | 'DUPLICATE' | 'BUSINESS_RULE' | 'NETWORK_TIMEOUT';
export type ConflictResolution = 'SERVER_WINS' | 'CLIENT_WINS' | 'MERGE' | 'MANUAL_REVIEW';
export type NetworkQuality = 'OFFLINE' | 'POOR' | 'FAIR' | 'GOOD';

export interface OfflineAction {
  id: string;
  type: string;
  payload: unknown;
  createdAt: number;
  idempotencyKey: string;
  retries: number;
}

export interface SyncConflict {
  actionId: string;
  type: ConflictType;
  message: string;
  serverSnapshot?: unknown;
}
