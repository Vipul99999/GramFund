# GramFund Frontend (Next.js PWA)

Offline-first web client for GramFund operations across handler, family, and admin experiences.

## Objectives
- Keep user workflows usable during poor/no connectivity.
- Prevent accidental duplicate financial actions on retries.
- Surface clear conflict/resolution states after sync attempts.

## Tech Stack
- Next.js (App Router)
- React + TypeScript
- PWA assets (`public/manifest.json`, `public/sw.js`)
- Local offline queue + sync engine modules

## Project Structure
- `src/app/` — pages/routes
- `src/features/payment/` — payment flow components/hooks/service
- `src/offline/` — queue, DB wrapper, network helpers, sync engine, conflict resolver
- `src/hooks/` — reusable hooks (`useOffline`, `useSync`, network quality)
- `src/store/` — state stores for offline/conflict state

## Run & Build
```bash
cd frontend
npm install
npm run dev
npm run build
```

## Configuration
Set environment variables in `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL` — backend URL (e.g., `http://localhost:3000`)

## Offline Workflow
1. User action is created in UI.
2. Action is queued locally when offline/unstable network.
3. Sync engine flushes queued actions when network improves.
4. Backend response determines success, retry, or conflict.
5. Conflicts are shown in `/offline/conflicts` for user visibility/resolution.

## Current UX Routes
- Auth: `/(auth)/login`, `/(auth)/verify-otp`
- Dashboards: `/(dashboard)/admin`, `/(dashboard)/family`, `/(dashboard)/handler`
- Handler payments: `/(dashboard)/handler/payments`
- Offline pages: `/offline/queue-status`, `/offline/conflicts`

## Integration Contract Notes
- Payment actions should send stable idempotency keys when possible.
- Sync API target is backend sync route (currently `/api/v1/sync` pattern in code).
- Conflict payloads should preserve enough metadata for deterministic replays.

## Documentation
For full frontend architecture and operational details, see:
- `frontend/docs/FULL_DOCUMENTATION.md`
