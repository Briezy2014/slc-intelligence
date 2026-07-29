# Progress Reporting

Phase 9 implements reporting periods, progress reports, goal sections, evidence links, status history, versions, and print export records.

## Application surface

- `/reports`
- `/reports/periods`
- `/reports/periods/new`
- `/reports/[reportId]`
- `/reports/[reportId]/review`
- `/reports/[reportId]/history`
- `/reports/[reportId]/print`
- `/students/[studentId]/reports`

## Guardrails

System-generated summaries are labeled as drafts requiring educator review. Reports must not contain automated decisions, service recommendations, or claims about legal sufficiency.

## Permissions

- `report.period.manage`
- `report.draft`
- `report.review`
- `report.finalize`
- `report.read`
- `report.export`

Server actions verify membership and report/student scope server-side before mutating rows. Browser-provided IDs are treated as hints only.
