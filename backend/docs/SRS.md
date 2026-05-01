# Software Requirements Specification (SRS)

## Functional Requirements
1. Users can authenticate via OTP and maintain refreshable sessions.
2. Authorized handlers can create payment events that produce immutable financial records.
3. System enforces core invariants before commit.
4. Offline clients can sync deferred actions with conflict reporting.
5. Operational users can inspect service metrics and queue state.

## Non-Functional Requirements
- **Correctness:** Double-entry and invariant checks are mandatory.
- **Reliability:** Idempotent operations and retry-capable job execution.
- **Security:** ABAC/RBAC authorization + auditable request processing.
- **Scalability:** API and worker processes scale independently.
- **Maintainability:** Clear modular boundaries and test coverage on finance-critical paths.

## Data Requirements
- Persist users, families, events, payments, transactions, ledger entries, settlements.
- Ensure monetary records include timestamps and traceable linkage.

## Interface Requirements
- REST-like JSON API for frontend and partner integrations.
- Queue contract for asynchronous workloads.

## Constraints
- PostgreSQL and Redis must be reachable in runtime environments.
- Prisma schema/migrations are source-of-truth for persistence structure.
