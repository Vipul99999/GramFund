export type JobName =
  | 'notification.send'
  | 'cache.warm'
  | 'ledger.reconcile'
  | 'report.generate'
  | 'cleanup.run'
  | 'retry.failed';

export type NotificationChannel = 'IN_APP' | 'PUSH' | 'SMS' | 'MANUAL';
export type NotificationPriority = 'LOW' | 'IMPORTANT' | 'CRITICAL';

export interface NotificationJobPayload {
  notificationId: string;
  userId: string;
  familyId: string;
  to: string;
  message: string;
  priority: NotificationPriority;
  attempt: number;
  channelsTried: NotificationChannel[];
  lastError?: string;
  finalChannel?: NotificationChannel;
}
export interface CacheWarmJobPayload { keys: string[] }
export interface LedgerReconcileJobPayload { eventId?: string; familyId?: string }
export interface ReportJobPayload { reportType: string; actorId: string }
export interface CleanupJobPayload { scope: 'sessions' | 'otp' | 'notifications' }
export interface RetryFailedPayload { jobName: JobName; referenceId: string }
