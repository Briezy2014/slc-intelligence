# Intervention Intelligence

Phase 12 implements intervention library items, student intervention plans, components, target/replacement links, staff assignments, schedules, fidelity checklists, fidelity observations, dosage logs, reviews, outcome links, status history, and phases.

## Application surface

- `/interventions`
- `/interventions/library`
- `/interventions/library/[id]`
- `/interventions/library/new`
- `/students/[studentId]/interventions`
- `/students/[studentId]/interventions/[planId]`
- `/students/[studentId]/interventions/fidelity`
- `/students/[studentId]/interventions/dosage`
- `/students/[studentId]/interventions/analytics`
- `/students/[studentId]/interventions/reviews`

## Calculations

Deterministic helpers calculate fidelity percentage, component fidelity, dosage percentage, planned-versus-delivered summaries, dosage trend summaries, and phase comparisons.

Phase comparisons include this warning: they describe observed differences only and do not establish cause.

## Permissions

Intervention library, plan management, activation, fidelity entry/finalization, dosage entry, review, and read permissions are separate so restricted roles can enter evidence without managing or activating plans.
