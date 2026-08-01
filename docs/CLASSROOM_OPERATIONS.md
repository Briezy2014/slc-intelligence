# Classroom Operations

Classroom operations surfaces for schedules, routines, daily notes, announcements, and the Daily Command Center.

## Scope

- Classroom schedules and schedule blocks
- Daily student notes (coded students during pilot)
- Classroom routines
- Classroom announcements (no student PII)
- Daily Command Center route for today-focused work
- One-click owner classroom setup

## Owner classroom setup

Use **Create Williams SLC room 95 + students S1–S7** on Classroom Operations / Daily Command Center.

That action creates or refreshes:

1. **Williams School**
2. Classroom **Williams SLC room 95**
3. Coded students **S1–S7** (assigned to that classroom)
4. Weekday sample schedule + time blocks
5. Arrival routine + staff announcement

Safe to run more than once — it only fills missing pieces.

## Guardrails

- Reinforcement records must not be used for punitive ranking or deprivation of basic needs.
- Classroom announcements are guarded against student PII and should stay classroom-level.
- Daily notes remain student-scoped records.
- During the pilot, use coded students (**S1–S7**) only — never real student or family PII.

## Application layer

- Workspace UI: `src/components/domain/classroom-operations-workspace.tsx`
- Data module: `src/lib/data/classroom-operations.ts`
- Actions: `src/lib/actions/classroom-operations.ts`
- Owner setup: `src/lib/actions/pilot-demo-setup.ts`
- Validation: `src/lib/validation/classroom-operations.ts`
- Routes:
  - `/classroom-operations`
  - `/classroom-operations/daily`
  - `/classroom-operations/schedules`
  - `/classroom-operations/notes`
  - `/classroom-operations/routines`
  - `/classroom-operations/announcements`
  - `/classrooms/[classroomId]/schedule`
