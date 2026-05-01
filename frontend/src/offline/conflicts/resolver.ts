import { ConflictResolution, SyncConflict } from '../../types/common.types';

export const resolveConflict = (conflict: SyncConflict): ConflictResolution => {
  switch (conflict.type) {
    case 'DUPLICATE':
      return 'SERVER_WINS';
    case 'VERSION_MISMATCH':
      return 'MANUAL_REVIEW';
    case 'BUSINESS_RULE':
      return 'MANUAL_REVIEW';
    case 'NETWORK_TIMEOUT':
      return 'CLIENT_WINS';
    default:
      return 'MANUAL_REVIEW';
  }
};
