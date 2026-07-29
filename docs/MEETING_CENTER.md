# Meeting Center

Phase 14 adds meeting management surfaces for student-scoped meetings.

## Scope

- Meeting types, meetings, participants, agenda items, notes, action items, acknowledgements, and document metadata.
- Student-scoped meeting views.

## Guardrails

- External participants are stored as meeting participant records and do not create authentication users.
- Meeting acknowledgements describe receipt or review only; acknowledgement is not consent.
- Internal prep notes remain controlled by meeting-note visibility/RLS rules.

## Application layer

- Data module: `src/lib/data/meetings.ts`.
- Actions: `src/lib/actions/meetings.ts`.
- Validation: `src/lib/validation/meetings.ts`.
- Routes:
  - `/meetings/[[...slug]]`
  - `/students/[studentId]/meetings`
