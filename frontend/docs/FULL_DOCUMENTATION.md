# Frontend Full Documentation

## 1. Purpose
The frontend delivers a role-aware PWA experience optimized for unstable network conditions while protecting financial workflows against duplicate or hidden failures.

## 2. Architecture Overview
| Layer | Responsibility |
|---|---|
| Routing/UI | App Router pages and visual components |
| Feature | Business-oriented hooks/services (e.g., payments) |
| Offline | Queueing, network heuristics, sync orchestration |
| State | Local stores for queue/conflict/user-visible state |
| Integration | API client and backend contract mapping |

## 3. Route Surfaces
- Auth: login and OTP verification flows.
- Dashboard: role-based landing pages.
- Handler payments: form-driven payment creation.
- Offline utilities: queue status and conflict inspection.

## 4. Offline Design
### 4.1 Why Offline-first
Target users may operate with unstable connectivity; user actions cannot be blocked on perfect network availability.

### 4.2 Lifecycle
1. Capture UI action.
2. Decide direct-send vs local-queue using connectivity heuristics.
3. Persist queued action for deferred sync.
4. Attempt queued flush in deterministic order.
5. Classify outcomes: success, retryable error, conflict.
6. Surface unresolved conflicts to dedicated UI.

### 4.3 Conflict Handling
- Conflicts are explicitly tracked rather than silently dropped.
- Conflict visibility is provided under `/offline/conflicts`.
- Resolver strategy should preserve action metadata for deterministic replay.

## 5. Reliability and Safety Considerations
- Prefer stable idempotency keys for mutation operations.
- Keep sync retries bounded and observable.
- Avoid hidden state mutation in page components; use feature/offline layers.

## 6. Setup and Build
```bash
cd frontend
npm install
npm run dev
npm run build
```

## 7. Configuration
- `NEXT_PUBLIC_API_BASE_URL` must point to the backend API origin.

## 8. Deployment Notes
- Ensure PWA assets are served correctly.
- Validate service worker strategy against API caching semantics.
- Confirm auth/session behavior under production domain and TLS settings.

## 9. Testing Roadmap
Recommended additions for production hardening:
- Unit tests for queue/sync decision branches.
- Component tests for payment + conflict UX.
- E2E tests simulating offline→online replay sequences.

## 10. Documentation Discipline
When sync contracts, routes, or user flows change, update:
1. `frontend/README.md`
2. this document
3. any affected backend API blueprint references
