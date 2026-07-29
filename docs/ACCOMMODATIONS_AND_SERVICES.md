# Accommodations and Services

Phase 13 adds application-layer surfaces for accommodation supports and related-service operational records.

## Scope

- Accommodation library items, student accommodations, implementation logs, and accommodation reviews.
- Service definitions, student service plans, components, delivery logs, group participants, reviews, and export records.
- Provider workspace views for draft service delivery logs.

## Guardrails

- Accommodation/service records are descriptive support records and do not determine legal compliance.
- Planned and recorded service minutes disclose assumptions and missing data; missing values are not treated as zero.
- Documentation gaps are described as incomplete or unavailable records, not as "owed minutes."
- Group service logs must verify every participant is authorized before insertion.

## Application layer

- Data modules: `src/lib/data/accommodations.ts`, `src/lib/data/services.ts`.
- Actions: `src/lib/actions/accommodations.ts`, `src/lib/actions/services.ts`.
- Validation: `src/lib/validation/accommodations.ts`, `src/lib/validation/services.ts`.
- Routes:
  - `/accommodations/[[...slug]]`
  - `/students/[studentId]/accommodations/[[...slug]]`
  - `/services/[[...slug]]`
  - `/students/[studentId]/services/[[...slug]]`
