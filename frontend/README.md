# GramFund Frontend (Next.js PWA)

Offline-first client for GramFund handlers, admins, and family users.

## Highlights
- Next.js app router structure.
- PWA scaffolding (`manifest.json`, service worker).
- Offline queue and sync engine.
- Conflict tracking UI for eventual consistency edge cases.

## Run
```bash
cd frontend
npm install
npm run dev
```

## Build & Check
```bash
npm run build
```

## Key Areas
- `src/app/*` – routes/pages
- `src/offline/*` – queue, network, sync engine, local persistence
- `src/store/*` – lightweight client state stores
- `src/features/payment/*` – payment flow UI/hooks/services

## Offline Behavior
- User actions can be queued while offline.
- Sync engine flushes queued actions when connectivity returns.
- Conflicts are captured and displayed in `/offline/conflicts`.

## UX Priorities
- Clear pending/sync/conflict status at all times.
- Safe retries without duplicate financial impact.
- Predictable role-based navigation and action visibility.
