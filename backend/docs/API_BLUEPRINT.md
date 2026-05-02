# API Blueprint

## Conventions
- Base path: version via route grouping when introduced (e.g., `/v1`).
- Payload format: JSON.
- Authentication: bearer token for protected routes.
- Idempotency: required on payment-like mutation endpoints.

## Key Endpoint Groups

### Auth
- `POST /auth/login`
  - Request OTP or verify OTP depending on payload.
- `POST /auth/refresh-token`
  - Rotate refresh/access token pair.
- `POST /auth/logout`
  - Revoke active session/token.

### Payment
- `POST /payments`
  - Validates invariants.
  - Orchestrates transaction + ledger posting.
  - Supports idempotency.

### Transaction / Ledger
- Transaction retrieval and filtered views for auditing and UIs.
- Ledger views are read-only representations of recorded entries.

### Sync / Offline
- Sync endpoints accept queued client actions.
- Conflicts are surfaced for explicit client resolution.

### Ops
- `GET /ops/metrics` for service counters and health indicators.
- `GET /ops/dlq` for dead-letter queue diagnostics pathing.

## Error Envelope (Target)
```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human-readable explanation",
    "requestId": "trace-id"
  }
}
```

## Status Code Guidance
- `200/201`: successful read/create
- `400`: validation/invariant violation
- `401/403`: authn/authz failure
- `409`: idempotency or conflict state
- `500`: unexpected server error
