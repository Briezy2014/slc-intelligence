# Family Communication

Phase 14 adds contact and communication logging workflows for authorized student scopes.

## Scope

- Student contacts and preferences.
- Communication categories, templates, logs, participants, and follow-ups.
- Family-visible export recording.

## Guardrails

- The platform records communication metadata and summaries; it does not send messages automatically.
- `family_visible`, `internal`, and `restricted_admin` records remain separated.
- Family-visible exports include only `family_visible` logs and omit internal/restricted records.
- Internal/restricted records require `communication.internal.read` in addition to communication read scope.

## Application layer

- Data module: `src/lib/data/communications.ts`.
- Actions: `src/lib/actions/communications.ts`.
- Validation: `src/lib/validation/communications.ts`.
- Routes:
  - `/family-communication/[[...slug]]`
  - `/students/[studentId]/family-communication/[[...slug]]`
