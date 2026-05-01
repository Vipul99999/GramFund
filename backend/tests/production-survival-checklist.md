# Production Survival Checklist (Executable Mapping)

- [x] idempotency key required -> `core/invariants.ts`
- [x] no self transfer -> `core/invariants.ts`
- [x] positive amount -> `core/invariants.ts`
- [x] ledger double-entry pair check -> `core/invariants.ts`
- [x] fraud signals (high amount, rapid activity, delayed settlement) -> `modules/fraud/application/fraud-rules.service.ts`
- [x] offline conflict strategy (server-wins duplicate + retry) -> `frontend/src/offline/syncEngine.ts`
- [x] network-aware enqueue on poor connectivity -> `frontend/src/features/payment/hooks/usePaymentFlow.ts`
