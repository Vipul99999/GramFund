# Secrets Management Policy

## Requirements
- No plaintext production secrets in source control.
- Use managed secret stores (cloud secret manager / vault).
- Rotate signing keys and database credentials periodically.
- Scope secrets by environment and least privilege.

## Operational Controls
- Audit all secret reads/updates.
- Enforce break-glass access approval.
- Revoke compromised secrets immediately and force token/session re-issue.

## Minimum Required Secrets
- `AUTH_TOKEN_SECRET`
- `DATABASE_URL`
- `REDIS_URL`
- Any external provider/API keys
