# Backend Full Documentation

## 1. Purpose
This backend provides a ledger-first API surface for GramFund with strict correctness controls, explicit authorization, and async processing support.

## 2. Architectural Principles
1. **Correctness first:** Financial invariants are enforced before state mutation.
2. **Determinism:** Idempotency and predictable orchestration minimize retry risks.
3. **Separation of concerns:** Transport, domain, and infrastructure are layered.
4. **Observability readiness:** Metrics/ops routes and structured middleware hooks.

## 3. Runtime Topology
- Fastify API handles request-time workflows.
- PostgreSQL stores canonical domain records.
- Redis + BullMQ carry deferred/background work.
- Worker service executes queued tasks independently.

## 4. Request Lifecycle
1. Request enters middleware pipeline.
2. Authentication and authorization context is resolved.
3. Validation + invariant checks run before orchestration.
4. Application service persists transactionally related entities.
5. Optional async jobs are published for post-commit processing.
6. Response is returned with normalized success/error format.

## 5. Domain Model Responsibilities
- **Payment:** Business-level payment intent and contextual metadata.
- **Transaction:** Financial movement representation and status transitions.
- **Ledger Entry:** Immutable debit/credit records enforcing balance.
- **Settlement:** Downstream reconciliation/closure workflows.

## 6. Security & Policy
- ABAC/RBAC logic controls route and operation access.
- Middleware-oriented enforcement keeps policy centralized.
- Audit/fraud hooks can be expanded for compliance workflows.

## 7. Reliability Patterns
- Idempotency key handling for duplicate request suppression.
- Queue retries with exponential backoff for transient worker failures.
- Conflict-aware sync contracts for eventually consistent clients.

## 8. Operational Endpoints
- Metrics and queue-diagnostic routes support runtime visibility.
- Operational tooling should monitor queue depth, retries, and failures.

## 9. Developer Workflow
```bash
cd backend
npm install
npm run check
npm test
```

## 10. Production Readiness Checklist
- [ ] Environment variables provisioned securely.
- [ ] Prisma migrations deployed and verified.
- [ ] Redis/queue and worker process healthy.
- [ ] Error/metrics monitoring integrated.
- [ ] Backup + incident runbooks documented.

## 11. Change Management Guidance
- Any mutation flow touching money should update both tests and docs.
- New endpoints should be reflected in API blueprint/route manifest.
- Queue contract changes require coordinated API + worker updates.
