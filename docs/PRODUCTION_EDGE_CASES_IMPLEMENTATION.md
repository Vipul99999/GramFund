# Production Edge Cases Implementation Map

## Concurrency & race conditions
- Implemented idempotency in-flight lock in sync route to prevent parallel duplicate acceptance.
- Existing unique idempotency pattern retained.
- Added race test (`backend/tests/api/sync-race.test.ts`).

## Time/date
- System timestamps already stored; next step is explicit `actualPaymentDate` and event date ranges in schema migration.

## Human behavior
- Pending commitment/reminder flows documented as next implementation milestones.

## Identity confusion
- Dynamic auth + contextual family identity policy documented.

## Partial failure
- Notification retry status scaffolding exists; idempotency protects API retry after commit.

## Recovery/backup
- Incident playbook + backup policy documented; CI and runbooks include operational checks.

## Scaling/performance
- Pagination/search indexing and precomputed ledger aggregates tracked as roadmap.

## Security
- Replay mitigation implemented (idempotency + in-flight lock), risk and token services present.

## Product evolution
- Config/feature-flag direction captured in policy docs; migration path via Prisma.
