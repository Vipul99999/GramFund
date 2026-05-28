# India Real-World Production Checklist

## Implemented now
- Governance SLA automation endpoint: post-cutoff missing cash close triggers risk downgrade + fraud alert.
- Variance-threshold escalations: high variance creates critical fraud alerts + freezes high-value actions via lower daily limits.
- Ledger period lock semantics enforced in transaction writes (closed month blocks new transactions).
- Identity-based legal acceptance guard with route-level legal binding + audit logging.
- Notification provider adapter architecture + webhook signature validation + retry worker primitive.
- Projector checkpoint + idempotency logs for incremental read-model projection.
- Receipt storage pipeline with signed URLs and retention metadata.
- Security policy check script integrated in CI.
- India field operations pack: localized IVR scripts, print-first workflows, operator onboarding program.
- Secret rotation runbook documented.

## Remaining rollout tasks
1. Plug production SDK credentials (FCM, MSG91, WhatsApp BSP, Exotel/Knowlarity) and callback endpoints.
2. Replace stub object storage adapter with S3/R2/MinIO signed URL implementation.
3. Move SLA/projector/retry endpoints into scheduled BullMQ jobs.
4. Add automated retention deletion worker for evidence artifacts.
5. Integrate Vault/KMS APIs for dynamic key fetch and rotation event ingestion.
