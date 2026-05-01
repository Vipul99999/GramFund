# Migration 0001_init

Initial schema baseline for GramFund core entities (users, family/event model, payments, transactions, ledger, settlements, and support tables).

## Apply
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

## Notes
- Use deploy migrations in CI/prod; avoid ad-hoc drift.
- Follow with smoke tests for payment orchestration and invariants.
