import { runNotificationWorker } from '../workers/notification.worker.js';
import { runCacheWarmWorker } from '../workers/cache-warm.worker.js';
import { runReconciliationWorker } from '../workers/reconciliation.worker.js';
import { runReportWorker } from '../workers/report.worker.js';
import { runCleanupWorker } from '../workers/cleanup.worker.js';
import { runRetryWorker } from '../workers/retry.worker.js';

export const registerAllWorkers = () => ({
  'notification.send': runNotificationWorker,
  'cache.warm': runCacheWarmWorker,
  'ledger.reconcile': runReconciliationWorker,
  'report.generate': runReportWorker,
  'cleanup.run': runCleanupWorker,
  'retry.failed': runRetryWorker
});
