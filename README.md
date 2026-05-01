# GramFund = “Digital accounting system for community-based financial support”

[![Status](https://img.shields.io/badge/status-scaffold-blue)](#)
[![Node](https://img.shields.io/badge/node-20%2B-339933)](#)
[![TypeScript](https://img.shields.io/badge/typescript-enabled-3178C6)](#)

## 💰 GramFund

GramFund is a **community-based financial contribution and settlement system** built for rural and semi-urban environments where families support each other during important life events.

Traditionally, these contributions are tracked manually or remembered over time, often leading to confusion, disputes, or loss of trust. GramFund solves this by introducing a **digital ledger system** that records every transaction and maintains long-term financial relationships between families.

---

## 🚀 Key Features

* 🧾 **Ledger-Based System**
  Automatically tracks total given, received, and net balance per family

* 🎉 **Event-Based Contributions**
  Manage contributions for weddings, ceremonies, and other events

* 👨‍👩‍👧‍👦 **Family-Centric Design**
  Families act as financial entities independent of app users

* 👨‍🔧 **Handler Workflow**
  Field operators collect and record payments (cash/online)

* 🔐 **Secure & Reliable**
  OTP-based authentication, role-based + attribute-based access control

* 🔁 **Idempotent Transactions**
  Prevent duplicate entries and ensure financial accuracy

* 🔔 **Smart Notifications**
  Multi-channel alerts (SMS, push, manual fallback)

---

## 🧠 Core Concept

> GramFund is not a payment app—it is a **financial memory system**.

Every contribution is recorded as a transaction, and all balances are derived from a **double-entry ledger**, ensuring long-term consistency and trust.

---

## 🎯 Goal

To digitize community-based financial systems and create a **transparent, scalable, and trustworthy ecosystem** for mutual support.


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
