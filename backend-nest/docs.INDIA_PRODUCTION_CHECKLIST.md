# India Real-World Production Checklist

## Implemented in this revision
- Multi-language backend messages: English, Hindi, Bengali, Tamil.
- Witness-enabled transactions.
- Handler daily exposure limits.
- Multi-party approval records for high-value transactions.
- Receipt engine response payload supporting PDF/thermal/QR/WhatsApp composition.
- Assisted account mode for non-smartphone families.
- Offline event replay API with de-dup by eventId.
- Notification fallback queue chain: Push -> SMS -> WhatsApp -> IVR.
- Ledger period close primitive.
- Succession workflow primitive.
- Financial event stream table for immutable timeline.
- Cash closing, evidence attachments, legal disclaimer acceptance, relationship ledger.

## Operational rollout required next
1. Integrate real QR/PDF/WhatsApp/IVR provider SDKs.
2. Add policy-based approval rules by village and role.
3. Implement signed receipt verification endpoint.
4. Add conflict policy resolver for out-of-order sync events.
5. Run legal reviews per state and product module.
6. Add training SOP and village onboarding playbooks.
