# GramFund Financial Integrity & Acceptable Use Policy

## 1. Purpose
This policy defines mandatory controls for preventing misuse, fraud, and illegal activity in GramFund financial workflows.

## 2. Prohibited Activities
Users and operators must not use GramFund for:
- Money laundering, terrorist financing, or sanctions evasion.
- Fraudulent collection campaigns or misrepresentation of beneficiaries.
- Circular/self-dealing transactions intended to obscure fund origin.
- Unauthorized account access, identity misuse, or credential sharing.
- Deliberate duplicate replay attempts to force double-credit behavior.

## 3. Platform Controls
GramFund enforces technical controls including:
- Idempotency checks to suppress duplicate side effects.
- Invariant rules for positive amounts and no self-transfer patterns.
- Audit and fraud signal middleware paths.
- Queue-backed retries with observable failure handling.

## 4. KYC / Verification Expectations
For production environments, platform operators should enforce:
- Verified identity for payout-capable accounts.
- Beneficiary ownership checks for destination accounts.
- Region-appropriate verification thresholds by risk tier.

## 5. AML / Monitoring Requirements
Operators should implement:
- Velocity and amount anomaly detection.
- Structuring/smurfing detection (many small transactions to evade thresholds).
- Suspicious activity review workflow with case management.
- Retention of audit logs for legal review periods.

## 6. Enforcement & Incident Response
If suspected abuse is detected:
1. Temporarily freeze relevant payout operations.
2. Preserve logs and evidence trails.
3. Escalate to compliance/security reviewers.
4. Report to authorities where legally required.
5. Document RCA and prevention action before restoration.

## 7. User Responsibilities
Users must:
- Provide truthful profile and payment purpose information.
- Use only authorized funding/payment methods.
- Avoid attempts to bypass controls or mask identity.

## 8. Operator Responsibilities
Operators must:
- Maintain clear Terms, Privacy, and dispute resolution policies.
- Periodically review fraud rules and thresholds.
- Apply least-privilege access to operational tools.

## 9. Policy Governance
- Version: 1.0
- Effective Date: 2026-05-02
- Owner: Platform Governance
- Review Cycle: Quarterly or after any material risk event.
