# GramFund Backend

Ledger-first backend for GramFund, built with Fastify + TypeScript and designed for financial correctness, traceability, and offline-capable client sync.

## Goals
- Guarantee **financial invariants**: no self-transfer, no negative amounts, balanced double-entry posting.
- Provide **idempotent payment orchestration** for flaky/mobile networks.
- Enable **role- and policy-based authorization** through ABAC/RBAC layers.
- Integrate with **async workers** for retries, notifications, reconciliation, and reporting.

## Stack
- Runtime: Node.js 20+, TypeScript
- HTTP: Fastify
- Data: Prisma ORM (PostgreSQL target)
- Queue: BullMQ + Redis
- Testing: Node test runner / TS checks

## Project Structure
- `src/app.ts` – app composition
- `src/server.ts` – server bootstrap
- `src/modules/*` – feature modules (auth, payment, ledger, settlement, etc.)
- `src/middleware/*` – request pipeline concerns
- `src/abac/*` – authorization policies/types
- `src/lib/*` – infrastructure adapters (queue, prisma, redis)
- `tests/*` – invariants and orchestration tests

## Quick Start
```bash
cd backend
npm install
npm run check
npm test
```

## Environment
Create `.env` with at least:
- `DATABASE_URL` – PostgreSQL connection
- `REDIS_URL` – Redis connection string
- `PORT` – API port (default application-level fallback)

## Local DB Workflow (Prisma)
```bash
npx prisma generate
npx prisma migrate deploy
```

## Queue + Worker
API enqueues jobs via `src/lib/queue.ts`; processing occurs in `worker-service/`.

## Quality Gates
- `npm run check` must pass.
- `npm test` must pass.
- Any change to financial flow should include/adjust tests in `tests/payment-orchestration.test.ts` and invariants tests.

## Operational Notes
- Keep idempotency keys stable across client retries.
- Prefer append-only ledger behavior; never mutate historical finance events silently.
- Record audit events for privileged or sensitive workflows.
