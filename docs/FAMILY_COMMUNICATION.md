# Family Communication

Phase 14 adds contact and communication logging workflows for authorized student scopes.

## Scope

- Student contacts and preferences.
- Communication categories, templates, logs, participants, and follow-ups.
- **Template & language** drafting with 20-language translation assist.
- Expanded populated school letter templates (IEP/ETR/504, behavior incident, bus, conference, etc.).
- Parent/guardian **read acknowledgment** on family-visible communications: checkbox “I have read this” + typed name + send (optional drawn signature) via secure sign link.
- In-app **staff notifications** when a parent reads/acknowledges a letter.
- Family-visible export recording.

## Guardrails

- The platform records communication metadata and summaries; it does not send messages automatically.
- `family_visible`, `internal`, and `restricted_admin` records remain separated.
- Family-visible exports include only `family_visible` logs and omit internal/restricted records.
- Internal/restricted records require `communication.internal.read` in addition to communication read scope.
- E-sign captures receipt acknowledgment only — not IDEA/IEP consent. See `COMMUNICATION_ESIGN.md`.
- Translations require educator/interpreter review; acknowledgements are not IDEA consent.
- See `COMMUNICATION_TRANSLATION_AND_PLANS.md` and SQL migrations `202607300013_comms_translation_plans_district_forms.sql`, `202607300014_communication_esign.sql`, and `202607300015_staff_notifications_parent_read.sql`.

## Application layer

- Data module: `src/lib/data/communications.ts`.
- Actions: `src/lib/actions/communications.ts`.
- Validation: `src/lib/validation/communications.ts`.
- Routes:
  - `/family-communication/[[...slug]]`
  - `/students/[studentId]/family-communication/[[...slug]]`
