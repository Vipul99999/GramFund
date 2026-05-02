# GramFund Real-World Coverage Map (Handled Checklist)

Legend: [x] implemented baseline, [~] partially handled + roadmap.

## 1) Family relationship & social
- [x] Selective giving via pairwise transactions (`fromFamilyId -> toFamilyId`).
- [~] Social relation priority tags documented (next: persist + recommendation engine).

## 2) Contribution behavior
- [~] Goodwill/extra-credit flow documented (next: dedicated `extraCredit` persistence workflow).
- [~] Partial-payment policy documented (next: village/event-level config enforcement).

## 3) Family lifecycle
- [x] Deactivation without history loss via `isActive` pattern.
- [~] Split/merge workflows documented (next: dedicated split/merge models + ledger transfer service).

## 4) Event complexity
- [x] Event cancellation status supported.
- [x] Participant list model supports dynamic participant lifecycle.
- [x] Multiple concurrent events supported by event-scoped records.

## 5) Handler controls
- [x] Fraud signals and risk services exist.
- [x] Audit middleware exists.
- [~] Primary-handler and area assignment documented (next schema + assignment controls).

## 6) Payments
- [x] `eventId` can be null for general-help style payments.
- [x] payment mode + reference/proof fields scaffold exists.
- [~] Proof verification lifecycle partially modeled (next admin verification workflow).

## 7) Notifications
- [x] delivery status + retry count patterns exist.
- [~] manual no-phone family notification path documented (next UI/admin action tooling).

## 8) Offline
- [x] idempotency-based duplicate protection.
- [x] sync conflict handling with server-wins duplicate resolution.
- [~] device-loss unsynced warning policy documented (next client UX alerts).

## 9) Consistency
- [x] village uniqueness rules documented and modeled through address constraints.
- [x] duplicate family names allowed; identity is ID-based.

## 10) Analytics
- [~] roadmap only: top contributors, net owed families, relation graph, trust score.

## 11) UX
- [x] offline-first behavior and low-bandwidth-first architecture.
- [~] low-literacy UX roadmap (icons/voice).

## 12) System controls
- [x] policy + compliance + dispute + ops routes exist.
- [~] explicit freeze-lock admin workflows are roadmap.

## 13) Legal / trust
- [x] financial policy + auth onboarding policy + secrets policy docs.
- [x] dispute module scaffold + admin resolution pathways.

## 14) Scale
- [~] multilingual support started (English + Hindi UI toggle).
- [~] mobile app, AI suggestions, inter-village expansion remain roadmap.
