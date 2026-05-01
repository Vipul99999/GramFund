# GramFund — Ledger-First, Offline-Capable Financial Platform

[![Status](https://img.shields.io/badge/status-scaffold-blue)](#)
[![Node](https://img.shields.io/badge/node-20%2B-339933)](#)
[![TypeScript](https://img.shields.io/badge/typescript-enabled-3178C6)](#)

A production-oriented monorepo scaffold for building **financially-correct payment workflows** with **offline-first client experiences**.

> Ideal for showcasing on GitHub and LinkedIn as a systems-design-heavy, full-stack architecture project.

---

## ✨ Highlights
- **Ledger-first financial model** with double-entry principles.
- **Idempotent orchestration** patterns for retry-safe operations.
- **ABAC/RBAC-ready backend** with middleware-based policy enforcement.
- **Offline-first PWA frontend** with local queue, sync, and conflict visibility.
- **Async worker service** (BullMQ + Redis) for background processing.
- **Clear architecture docs** for backend and frontend evolution.

---

## 🧱 Monorepo Structure
```text
GramFund/
├── backend/                 # Fastify API + Prisma schema + domain services + tests
│   ├── src/
│   ├── prisma/
│   ├── docs/
│   └── worker-service/      # BullMQ worker runtime
└── frontend/                # Next.js PWA + offline queue/sync UX
```

---

## 🏗️ System Architecture (High-Level)
1. User triggers an action in the frontend (online or offline).
2. Backend validates authentication, authorization, and financial invariants.
3. Payment orchestration persists payment + transaction + ledger entries.
4. Post-commit tasks are queued to Redis/BullMQ.
5. Worker service executes async jobs (retry/backoff-ready).

---

## 🔒 Core Engineering Principles
- **Correctness over convenience** (invariants and balanced postings first).
- **Deterministic mutations** (idempotency to prevent duplicate side effects).
- **Separation of concerns** (API orchestration vs worker execution).
- **Operational transparency** (metrics/ops routes and documented workflows).

---

## ⚙️ Tech Stack
- **Backend:** Fastify, TypeScript, Prisma
- **Data:** PostgreSQL
- **Queue:** Redis, BullMQ
- **Frontend:** Next.js (App Router), React, TypeScript, PWA assets
- **Tooling:** npm scripts, TypeScript checks, backend tests

---

## 🚀 Quick Start
### 1) Backend API
```bash
cd backend
npm install
npm run check
npm test
npm run dev
```

### 2) Worker Service
```bash
cd backend/worker-service
npm install
npm run dev
```

### 3) Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables
### Backend
- `DATABASE_URL`
- `REDIS_URL`
- `PORT`

### Worker
- `REDIS_URL`

### Frontend
- `NEXT_PUBLIC_API_BASE_URL`

---

## 🗃️ Database Setup
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

---

## 📚 Documentation
- Backend package guide: `backend/README.md`
- Backend deep docs: `backend/docs/`
- Worker guide: `backend/worker-service/README.md`
- Frontend package guide: `frontend/README.md`
- Frontend deep docs: `frontend/docs/FULL_DOCUMENTATION.md`

---

## 🧪 Quality Expectations
- Backend TypeScript checks and tests should pass before merge.
- Frontend build should pass for UI/integration changes.
- Docs should be updated for route, contract, or architecture changes.

---

## Governance and Documentation Standards
- All architecture, API contract, and workflow changes must be reflected in corresponding documentation.
- Financial mutation paths require explicit test coverage and reviewer validation.
- Queue and worker contract changes must be coordinated across API and worker services.

## Roadmap (Scaffold to Production)
1. Replace in-memory/test shims with hardened production infrastructure defaults.
2. Expand end-to-end testing across API, worker, and offline sync boundaries.
3. Add CI/CD pipelines with migration gates, release checks, and deployment safeguards.
4. Introduce observability baselines (metrics dashboards, alerts, and incident playbooks).

## License
This repository is currently provided as an internal scaffold. Add an explicit license before public distribution.
