# Audit and Retention

## Purpose

Define auditable events, audit record contents, retention categories, archival, legal-hold considerations, offboarding, restoration, and permanent deletion controls for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Planning only. No audit tables or retention jobs are implemented in Phase 0.

## Auditable Events

The future platform must support auditable activity for significant actions, including:

1. Viewing particularly sensitive records when required by policy
2. Creating records
3. Updating records
4. Deleting or archiving records
5. Restoring records
6. Exporting student information
7. Generating reports
8. Changing permissions
9. Changing assignments
10. Changing goal status
11. Signing or finalizing reports
12. Administrative impersonation, if ever allowed
13. Bulk operations
14. Data imports

## Audit Record Contents

Audit events should capture at least:

1. Actor
2. Organization
3. Subject record type and identifier
4. Action
5. Timestamp
6. Prior and new states where appropriate
7. Request or correlation identifier where available
8. Outcome (success/failure) where relevant
9. Scope context (school/program/classroom/student) when applicable

## Export Events

Export events are mandatory for student-information exports and should include export type, scope, format, and actor.

## Access Events

Not every page view necessarily requires durable audit storage. Access logging for particularly sensitive records should be policy-driven and approved before implementation.

## Retention Categories (Draft)

1. Operational configuration
2. Authentication and security logs
3. Educational records
4. Report snapshots
5. Export artifacts metadata
6. Audit events
7. Support investigation records
8. Legal hold overlays

Exact durations are unresolved and require product-owner and legal guidance.

## Archival

Archival should preserve educational and audit value while removing records from ordinary active workflows.

Archived records remain authorization-scoped and must not become broadly visible because they are archived.

## Legal Hold Considerations

Legal hold, if required by later policy, must prevent ordinary deletion or destructive archival until released through an authorized process.

## Organization Offboarding

Offboarding must define:

1. Access revocation
2. Export responsibilities and authorizations
3. Retention remaining after contract end
4. Eventual deletion or return process
5. Audit retention after offboarding

## Restoration

Restoration of soft-deleted or archived records must be authorized, audited, and constrained by legal hold and retention rules.

## Permanent Deletion Controls

Permanent deletion must:

1. Be explicitly authorized
2. Be distinguishable from soft deletion and archival
3. Be audited
4. Respect legal hold
5. Be unavailable through ordinary educator workflows unless expressly designed and approved

## Tamper Resistance

Audit history should be tamper-resistant and not editable through ordinary application workflows.

## Core Requirements

1. Significant actions are auditable
2. Exports are logged
3. Soft deletion and archival are preferred over immediate hard deletion for protected educational records
4. Retention is configurable and policy-driven over time

## Out of Scope

1. Final retention durations
2. Immutable storage vendor selection
3. Legal hold workflow UI in early phases

## Open Questions

1. Which sensitive view events require durable access logs?
2. How long must audit events be retained relative to educational records?
3. What offboarding export package is contractually required?
4. Are audit events writable only through controlled server-side services?
5. What irreversible deletion approvals are required for organization-initiated purge requests?

## Change History

| Date | Change | Author |
| --- | --- | --- |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
