# Contributing

## Development workflow
1. Start infra: `docker compose -f docker-compose.local.yml up -d`
2. Run backend, worker, and frontend using package READMEs.
3. Add/adjust tests for every behavior change.
4. Run checks before PR:
   - `cd backend && npm run check && npm test`
   - `cd frontend && npm test && npm run build`

## PR checklist
- [ ] Docs updated
- [ ] Tests added/updated
- [ ] No breaking contract changes without migration notes
- [ ] CI passes
