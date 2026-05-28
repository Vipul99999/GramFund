# India Real-World Production Checklist

## Implemented in this revision
- Hindi + English message support on auth and service error messaging basis (`x-lang`: `en|hi`).
- Witness-capable transactions.
- Handler risk guardrail via daily exposure limit enforcement.
- Financial event stream table for event-sourced audit timeline.
- Cash closing model for daily reconciliation.
- Evidence attachment model for UPI slips, receipts, and proof artifacts.
- Relationship ledger model for reciprocity intelligence.
- Legal disclaimer acceptance model for compliance boundary acknowledgement.

## Next must-build before national scale
1. Receipt pipeline: PDF + thermal + WhatsApp share + QR verify.
2. Multi-party approvals on high-value thresholds.
3. Assisted account workflows for non-smartphone families.
4. Offline sync queue endpoints and deterministic conflict resolution.
5. Notification fallback chain: Push -> SMS -> WhatsApp -> IVR.
6. Geo-audit and suspicious pattern rules.
7. Period close and ledger lock flows.
8. Succession workflows (family head/handler death transfer).
9. State-specific legal reviews and product constraints.
