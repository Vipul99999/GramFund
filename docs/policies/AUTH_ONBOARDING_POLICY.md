# GramFund Auth & Onboarding Policy (Production Strategy)

## Login Strategy (Cost-Optimized)
1. Email + Password (default, low cost)
2. Google OAuth
3. Phone + OTP (fallback / inclusive access)

## Dynamic Login Rule
Single identifier input:
- If identifier contains `@` => email/password flow.
- Otherwise => phone OTP flow.
- Google button => OAuth flow.

## User & Role Rules
- User may exist with only phone or only email.
- Default role is `USER`.
- `HANDLER` is admin-assigned only.
- Family is a financial entity; user is login identity.

## Handler & Village Rules
- Only admin creates handler accounts.
- Handler must map to one village context.
- Village uniqueness key: `name + pincode + district + state`.

## Family Rules
- Family creation by handler/admin only.
- Family self-signup is disabled by policy.
- Minimal: `name`, `villageId`, optional phone.

## SMS Cost Rules
- Prefer email login and OAuth for recurring users.
- OTP only when phone flow is selected.
- SMS notifications limited to OTP and critical payment confirmation.
