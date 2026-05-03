# GramFund

🧾 **Ledger-first financial platform** for transparent contribution collection, controlled payouts, and auditable reconciliation.

## Getting Started in 5 Minutes
1. Copy environment values:
   ```bash
   cp .env.example .env
   ```
2. Start local infrastructure:
   ```bash
   docker compose -f docker-compose.local.yml up -d
   ```
3. Start backend:
   ```bash
   cd backend && npm install && npx prisma generate && npx prisma migrate deploy && npm run dev
   ```
4. Start worker (new terminal):
   ```bash
   cd backend/worker-service && npm install && npm run dev
   ```
5. Start frontend (new terminal):
   ```bash
   cd frontend && npm install && npm run dev
   ```

📘 Full runbook: `docs/RUNBOOK_LOCAL_E2E.md`.

---

## Product Summary
- Bilingual UX baseline: English + Hindi language switcher in frontend auth/about flow.

GramFund combines:
- **Backend API** for auth, policy checks, invariants, and orchestration.
- **Worker service** for queue-driven async jobs.
- **Offline-capable frontend** with queue/sync/conflict handling.

It is designed to make payment flows deterministic, retry-safe, and traceable.

## Core Guarantees
- Double-entry-aware financial behavior.
- Idempotent sync and mutation patterns.
- Separation between request-time and async-time execution.
- Operational visibility and production-readiness checklists.

## Monorepo Structure
```text
GramFund/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── docs/
│   └── worker-service/
├── frontend/
├── docs/
└── .github/workflows/
```

## Documentation Map
- `backend/docs/ARCHITECTURE.md`
- `backend/docs/API_BLUEPRINT.md`
- `backend/docs/FULL_DOCUMENTATION.md`
- `frontend/docs/FULL_DOCUMENTATION.md`
- `docs/RUNBOOK_LOCAL_E2E.md`
- `ops/INCIDENT_PLAYBOOK.md`
- `docs/policies/FINANCIAL_POLICY.md`
- `docs/security/SECRETS_POLICY.md`
- `docs/policies/AUTH_ONBOARDING_POLICY.md`
- `docs/REAL_WORLD_COVERAGE_MAP.md`
- `docs/PRODUCTION_EDGE_CASES_IMPLEMENTATION.md`
- `docs/MASTER_CASES_PLAYBOOK.md`

## Environment Variables
Use `.env.example` as baseline:
- `DATABASE_URL`
- `REDIS_URL`
- `PORT`
- `NEXT_PUBLIC_API_BASE_URL`

## Quality Gates
- Backend: `npm run check` + `npm test`
- Frontend: `npm test` + `npm run build`
- CI pipeline enforces these checks on PRs.

## Maintainer
**Vipul Kumar Patel**

## License
MIT — see `LICENSE`.
