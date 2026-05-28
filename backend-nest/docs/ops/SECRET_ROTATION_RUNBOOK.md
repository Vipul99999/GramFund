# Secret Rotation Runbook

1. Rotate keys in KMS/Vault first.
2. Update runtime secrets for API/workers.
3. Restart workers then API with zero-downtime rollout.
4. Write `SecretRotationAudit` row with key name/version/operator.
5. Run synthetic checks: login, receipt sign, webhook signature verify.
6. Revoke previous key version after verification window.
