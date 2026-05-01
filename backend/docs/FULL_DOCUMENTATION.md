# GramFund Backend Full Documentation

## 1) Purpose
Provide a financially safe and operationally robust backend that supports online and offline-first payment workflows.

## 2) Core Capabilities
- OTP/session-based authentication
- ABAC/RBAC enforced authorization
- Payment orchestration to transaction + ledger entries
- Async jobs via Redis/BullMQ workers
- Operational endpoints for metrics and queue diagnostics

## 3) Domain Highlights
- Payments are business events triggering financial postings.
- Transactions represent movement intent and status.
- Ledger entries are immutable debits/credits ensuring balance.

## 4) Security
- Identity established in auth middleware.
- Permissions decided by role + policy checks.
- Audit and fraud middleware extend compliance posture.

## 5) Data & Persistence
- Prisma schema defines normalized entities and relationships.
- Migration flow uses `prisma migrate deploy`.
- Financial records should be treated append-only.

## 6) Async & Reliability
- Jobs use retry with backoff for transient failures.
- Worker handlers should be idempotent and observable.

## 7) API & Contracts
- Route manifest tracks exposed endpoints.
- GraphQL operation map exists for future extension.
- Job contracts define cross-process payload expectations.

## 8) Developer Workflow
```bash
cd backend
npm install
npm run check
npm test
```

## 9) Production Readiness Checklist
- [ ] Env vars configured (`DATABASE_URL`, `REDIS_URL`, auth secrets)
- [ ] Prisma migrations applied
- [ ] Queue + worker processes running
- [ ] Health/metrics monitored
- [ ] Backup and incident procedures documented

## 10) Extension Guidance
- New financial use-cases must pass invariants and add regression tests.
- Prefer adding module-local application services over bloating controllers.
- Keep docs synchronized with endpoint and schema changes.
