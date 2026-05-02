export type JobName =
  | 'notification.send'
  | 'cache.warm'
  | 'ledger.reconcile'
  | 'report.generate'
  | 'cleanup.run'
  | 'retry.failed';

export interface NotificationJobPayload { channel: 'SMS' | 'EMAIL' | 'PUSH'; to: string; message: string }
export interface CacheWarmJobPayload { keys: string[] }
export interface LedgerReconcileJobPayload { eventId?: string; familyId?: string }
export interface ReportJobPayload { reportType: string; actorId: string }
export interface CleanupJobPayload { scope: 'sessions' | 'otp' | 'notifications' }
export interface RetryFailedPayload { jobName: JobName; referenceId: string }


export const jobContracts = {
  'notification.send': 'NotificationJobPayload',
  'cache.warm': 'CacheWarmJobPayload',
  'ledger.reconcile': 'LedgerReconcileJobPayload',
  'report.generate': 'ReportJobPayload',
  'cleanup.run': 'CleanupJobPayload',
  'retry.failed': 'RetryFailedPayload'
} as const;
