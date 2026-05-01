import { NetworkQuality } from '../types/common.types';

export const getNetworkQuality = (): NetworkQuality => {
  if (typeof navigator === 'undefined' || !navigator.onLine) return 'OFFLINE';
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  const type = connection?.effectiveType;
  if (type === 'slow-2g' || type === '2g') return 'POOR';
  if (type === '3g') return 'FAIR';
  return 'GOOD';
};
