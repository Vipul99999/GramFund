import { workerEnv } from './config/env.js';
import { registerAllWorkers } from './jobs/job-registry.js';
import { startWorker } from './lib/queue.js';

const registry: Record<string, (payload: unknown) => Promise<void>> = registerAllWorkers();
await startWorker(registry);
console.log('Worker service started', workerEnv);
