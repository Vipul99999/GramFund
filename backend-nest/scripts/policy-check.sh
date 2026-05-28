#!/usr/bin/env bash
set -euo pipefail

echo "Checking required security env keys..."
required=(PII_ENCRYPTION_KEY RECEIPT_SIGNING_KEY NOTIFICATION_WEBHOOK_SECRET)
for k in "${required[@]}"; do
  if ! rg -n "^${k}=" backend-nest/.env.example >/dev/null; then
    echo "Missing ${k} in backend-nest/.env.example"
    exit 1
  fi
done

echo "Checking for forbidden dev fallback secrets in source..."
if rg -n "dev-receipt-key|dev-webhook-secret|dev-pii-key" backend-nest/src >/dev/null; then
  echo "Found dev fallback secret literal in source; fail policy check"
  exit 1
fi

echo "Policy checks passed"
