# Architecture Overview

## System Context
GramFund is split into:
1. **Backend API** (Fastify): validation, auth, orchestration, persistence.
2. **Worker Service** (BullMQ workers): async job execution and retries.
3. **Frontend PWA** (Next.js): offline-first interactions + sync.

## Backend Layers
1. **HTTP Layer**
   - Route registration through plugins.
   - Schema validation and response shaping.
2. **Application Layer**
   - Use-case orchestration (payments, settlements, auth sessions).
3. **Domain Layer**
   - Financial invariants and policy decisions.
4. **Infrastructure Layer**
   - Prisma repositories, Redis/BullMQ, utility integrations.

## Financial Core Principles
- Double-entry posting is mandatory for monetary movement.
- Transaction + ledger entries are produced atomically by orchestration flows.
- Idempotency key protects against duplicate processing.

## Security Model
- Authentication middleware establishes caller identity.
- ABAC/RBAC middleware enforces role and policy constraints.
- Audit/fraud hooks allow enrichment for high-risk operations.

## Asynchronous Processing
- API publishes jobs to queue.
- Worker registry maps job names to handlers.
- Retry policy uses exponential backoff for transient failures.

## Deployment Topology
- API and worker can scale independently.
- Shared PostgreSQL + Redis infrastructure.
- Horizontal API scaling safe when stateless sessions/tokens are used.

## Failure & Recovery
- Retry transient job failures through BullMQ strategy.
- Keep idempotency + ledger invariants deterministic to recover from restarts.
- Maintain observability endpoints for operational state.
