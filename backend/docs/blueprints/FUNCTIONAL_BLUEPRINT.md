# Functional Blueprint

## Primary Actors
- **Family Member/User**: authenticates and participates in family/event flows.
- **Handler**: executes payment operations.
- **Admin/Ops**: monitors health, disputes, and queue issues.

## Core Flows
1. User login with OTP.
2. Handler submits payment.
3. Backend validates invariants and permissions.
4. Transaction and ledger entries persist atomically.
5. Follow-up jobs enqueue for notifications/reconciliation.
6. Offline client sync resolves eventual conflicts.

## Decision Rules
- Reject self-transfer and non-positive payment amounts.
- Enforce role-policy compatibility on privileged actions.
- Honor idempotency key to deduplicate retried commands.

## Operational Flows
- Dead-letter queue inspection and replay workflow.
- Metrics sampling for throughput/failure tracking.

## Evolution Priorities
- Harden schema constraints and DB-level protections.
- Expand integration tests for queue + DB + API boundary.
- Add full audit event stream export.
