# Administrative Intelligence

## Purpose

Provide role-aware administrative workflow analytics for authorized leaders without expanding access, ranking people, or making legal determinations.

## Principles

1. Display only records the user is authorized to access.
2. Use the same authorization rules as underlying modules.
3. Never allow a dashboard to expand access.
4. Distinguish documentation presence from educational quality.
5. Distinguish recorded delivery from legal sufficiency.
6. Distinguish correlation from causation.
7. Do not rank students, teachers, paraprofessionals, classrooms, or schools.
8. Use neutral workflow language such as “Review needed” and “Documentation incomplete.”

## Permissions

| Permission                | Purpose                           |
| ------------------------- | --------------------------------- |
| `admin.intelligence.read` | View authorized aggregates        |
| `admin.export`            | Export suppressed summaries       |
| `admin.audit.read`        | View administrative export events |

Default grants:

- Organization admin and district SPED admin: read, export, audit
- Building admin and program admin: read

## Small-group suppression

Organization privacy settings store `small_group_threshold` (default 5).

Positive counts below the threshold display “Suppressed to protect privacy.”

Rates are suppressed when the denominator is below the threshold.

Suppression applies to cards, chart alternatives, tables, exports, print views, and API/action responses.

The threshold is a product privacy control, not a legal standard.

## Metrics

See `src/lib/analytics/admin-metrics.ts` for definitions, explanations, and suppression flags.

Missing source records are presented as “No finalized record found,” not zero educational outcomes.

## Routes

Protected under `/administrative-intelligence` and nested dashboards for organization, schools, programs, classrooms, caseloads, reporting, services, accommodations, behavior, interventions, meetings, data quality, and audit.

Student names and sensitive narrative content are not placed in URLs.

## Exports

Exports:

1. Recheck `admin.export`
2. Reuse visible scope filters
3. Apply suppression
4. Record `administrative_export_events`
5. Include filters, timestamp, and scope summary
6. Avoid student identifiers in filenames
