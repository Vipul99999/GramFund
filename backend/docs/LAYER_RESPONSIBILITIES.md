# Layer Responsibilities

## HTTP/Transport
- Parse requests, validate payloads, map responses/errors.
- Never embed business finance logic directly in route handlers.

## Middleware
- Cross-cutting concerns: auth, authorization, logging, idempotency, fraud hooks, error normalization.
- Middleware must remain composable and side-effect-aware.

## Application Services
- Coordinate multi-step use-cases.
- Call domain rules and repositories in deterministic order.

## Domain
- Host invariant checks and core policy logic.
- Keep pure and framework-agnostic where possible.

## Infrastructure
- External integrations: DB, queue, cache, redis, external providers.
- Hide implementation detail behind repository/service interfaces.

## Workers
- Consume queued jobs, execute bounded tasks, emit retries/failures.
- Avoid embedding HTTP-specific assumptions.

## Frontend Sync Layer (cross-system note)
- Tracks pending operations, retries, and conflicts for eventual consistency.

## Testing Strategy by Layer
- Domain: pure unit tests.
- Application: orchestration tests with lightweight stubs/shims.
- Infra: integration checks against real services when possible.
