# Reporting and Exports

## Purpose

Define requirements for reports, exports, authorization, evidence references, accessibility, privacy safeguards, and retention for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Applies to progress reports, behavior summaries, administrative aggregates, communication exports, and any downloadable or printable student-related output.

## Report Types (Planned)

1. Progress-monitoring summaries
2. Goal evidence packages
3. Behavior observational summaries
4. FBA-supporting organization packets
5. Parent-friendly summaries
6. Administrator aggregates
7. Service documentation summaries
8. Accommodation implementation summaries
9. Meeting evidence packets
10. Data-quality and readiness reports

Exact first-release report set will be authorized in later phases.

## Authorization

1. Reports and exports must be permission-controlled.
2. Users must not export beyond authorized organizational and student scope.
3. Paraprofessional export access is denied by default unless expressly authorized.
4. Administrative aggregates must respect school, program, and organization scope.

## Date and Scope Labels

Every report should clearly show:

1. Report title
2. Generated date and time
3. Reporting period or selected date range
4. Organization and relevant school/program scope
5. Filters applied
6. Draft or final status

## Evidence References

Reports must be based on traceable evidence.

Where practical, summaries should identify:

1. Source record counts
2. Measurement methods
3. Exclusions
4. Data-quality limitations
5. Calculation methods

## Export Logging

Exports must be logged, including at minimum:

1. Actor
2. Organization
3. Export type
4. Scope
5. Timestamp
6. Target format
7. Related student or aggregate subject identifiers as appropriate for audit, without over-logging sensitive narrative content in insecure channels

## Accessible Output

Reports must be:

1. Accessible
2. Print-friendly
3. Understandable
4. Accompanied by text equivalents for charts
5. Free from unsupported conclusions
6. Explicit about missing or insufficient data

## Privacy Restrictions

1. No public student profiles
2. No student leaderboards
3. No exports to unauthorized destinations
4. Minimize data included in any export to the educational purpose
5. Use preferred privacy language; do not claim certifications

## Small-Group Suppression

Administrative analytics and exports that aggregate sensitive data must use privacy safeguards, including small-group suppression where appropriate.

Exact suppression thresholds are not finalized in Phase 0 and require product-owner approval.

## Report Snapshots

Finalized reports should support immutable or tamper-evident snapshots so later data edits do not silently rewrite a finalized artifact without history.

Snapshot strategy may store structured evidence packages, rendered output, or both.

## Draft Versus Final Status

1. Drafts are editable and clearly labeled.
2. Finalization is a privileged action.
3. Finalized reports require audit events.
4. Re-opening or superseding a finalized report must leave history.

## Watermarking Considerations

Consider watermarks or banners for:

1. Draft reports
2. Fictional demo data
3. Unauthorized-for-distribution previews if needed

Final watermark policy is unresolved.

## Retention Considerations

Exported files and generated report snapshots are subject to retention, archival, and deletion policies.

Local downloads leave organizational control; product language and training should warn users about handling responsibilities.

## Core Requirements

1. Scoped authorization
2. Evidence traceability
3. Export logging
4. Accessible, labeled output
5. Draft/final distinction

## Out of Scope

1. Medicaid billing exports
2. Full SIS export integrations in early phases
3. Final suppression thresholds
4. Automated sending of reports without user action

## Open Questions

1. Which roles may finalize parent-facing reports?
2. What small-n suppression threshold will administrative reports use?
3. Should exports allow CSV, PDF, or both in the first release?
4. How long are generated snapshots retained by default?
5. Are printable classroom quick-views treated as exports for logging purposes?

## Change History

| Date       | Change                | Author       |
| ---------- | --------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
