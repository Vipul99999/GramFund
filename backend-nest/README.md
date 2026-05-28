# GramFund NestJS Backend (Production Migration Track)

This workspace is the NestJS + Fastify target backend for GramFund CFOS.

## What is implemented now
- NestJS 11 + Fastify bootstrap with strict TypeScript.
- `/api/v1` versioned routing and Swagger docs on `/api/docs`.
- Prisma integration and PostgreSQL schema covering auth/session, villages, handlers, families, events, transactions, double-entry ledger, settlements, notifications, disputes, fraud alerts, and audit logs.
- Auth login endpoint (`email or phone + password`) with Argon2 verification + JWT access token.
- Transaction pipeline with idempotency-key check and atomic financial write (`Transaction` + two `LedgerEntry` rows + `AuditLog`) in one DB transaction.
- Basic operational controllers for villages/families/handlers/events/settlements/fraud/audit.
- Dockerfile and CI workflow.

## Production rules enforced in model/service
- Record-only finance model (platform does not hold money).
- Idempotent transaction key uniqueness.
- Double-entry ledger writes.
- Append-only style for financial audit trail.

## Next planned increments
- Refresh tokens and session revocation flow.
- ABAC policy engine with per-village handler scoping.
- Notification providers (FCM/MSG91) + BullMQ queues.
- Dispute workflows and adjustment-only correction model.
- Offline sync API and conflict resolution.
- Reporting (PDF/CSV export).

## Run locally
```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```
