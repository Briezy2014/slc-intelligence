# Classroom Operations

Phase 15 adds classroom operations surfaces for schedules, routines, duties, daily notes, announcements, and reinforcement systems.

## Scope

- Classroom schedules and schedule blocks.
- Student schedules and daily student notes.
- Classroom routines and staff/duty-oriented operational views.
- Classroom announcements and reinforcement-system records.
- Daily Command Center route for role-aware daily sections.

## Guardrails

- Reinforcement records must not be used for punitive ranking or deprivation of basic needs.
- Classroom announcements are guarded against student PII and should stay classroom-level.
- Daily notes remain student-scoped records.

## Application layer

- Data module: `src/lib/data/classroom-operations.ts`.
- Actions: `src/lib/actions/classroom-operations.ts`.
- Validation: `src/lib/validation/classroom-operations.ts`.
- Routes:
  - `/classroom-operations/[[...slug]]`
  - `/classroom-operations/daily`
  - `/classrooms/[classroomId]/schedule`
