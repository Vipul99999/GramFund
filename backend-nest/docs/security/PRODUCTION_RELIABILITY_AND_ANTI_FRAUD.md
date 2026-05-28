# Production Reliability, Security, and Anti-Fraud Controls

## Reliability under failure
- Global error filter with structured error envelope and stable request IDs.
- Idempotent transaction writes with duplicate key prevention.
- Period lock enforcement to prevent post-close mutations.
- Retry worker primitives for notification failures and dead-letter re-drive.
- Reliability health snapshot endpoint for live monitoring.

## Legal and security enforceability
- Identity-based legal disclaimer guard with audit logs.
- Mandatory secret policy checks in CI (`policy-check.sh`).
- Receipt signature verification and webhook signature checks.
- PII encryption utility with auditable encryption runs.
- Zero-trust access posture endpoint (legal access failure trends).

## Operator-grade field operations
- Assisted ops SOP and onboarding program.
- Localized IVR scripts (EN/HI/BN/TA/MR/TE).
- Print-first workflows for low connectivity.
- Cash-gap incident runbook with escalation actions.

## Fraud and illegal activity prevention
- SLA breach escalations and automatic risk downgrade.
- High variance auto-alert with transaction limit freeze.
- Detector run for high-pending and duplicate-key anomaly patterns.
- Transparency community wall endpoint for social audit.

## Edge cases covered
- Missing daily close after cutoff.
- Out-of-order sync events.
- Duplicate idempotency submissions.
- Pending approvals during finalize.
- Closed period mutation attempts.
- Signature mismatch on callbacks.
- Repeat failed notifications and dead-letter conditions.
