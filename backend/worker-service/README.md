# GramFund Worker Service

Executes asynchronous jobs published by the backend API queue.

## Responsibilities
- Consume BullMQ jobs from Redis.
- Route job payloads to registered handlers.
- Apply retry/backoff behavior for transient failures.
- Isolate background processing from request/response latency.

## Runtime
- Node.js 20+
- TypeScript
- BullMQ + ioredis

## Start
```bash
cd backend/worker-service
npm install
npm run dev
```

## Job Model
- Job names are registered in `src/jobs/job-registry.ts`.
- Worker bootstrap is in `src/worker.ts`.
- Queue adapter sits in `src/lib/queue.ts`.

## Reliability Guidance
- Handlers should be idempotent.
- Failures must be surfaced with enough context for replay.
- Prefer small, bounded jobs over long monolith jobs.
