# Database Schema Plan

## Purpose

Describe the planned multi-tenant data model domains, relationships, and database design principles for SLC Intelligence. This is a planning document only.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Phase 0 documents candidate tables and design rules. No SQL, migrations, or database objects are created in this phase.

## Multi-Tenant Hierarchy

Likely hierarchy:

Organization  
→ School  
→ Program  
→ Classroom or service team  
→ Student

Not every organization will use every level. The data model must support optional structures without weakening tenant isolation.

Every protected record must belong directly or indirectly to an organization.

## Core Domains

### Core tenancy and access

1. organizations
2. schools
3. programs
4. classrooms
5. teams
6. user_profiles
7. organization_memberships
8. school_assignments
9. program_assignments
10. classroom_assignments
11. student_staff_assignments
12. roles
13. permissions
14. role_permissions
15. invitations

### Student domain

1. students
2. student_enrollments
3. student_program_assignments
4. student_classroom_assignments
5. student_status_history
6. student_guardians or family contacts
7. student_alerts
8. student_tags, only if governed and appropriate

### IEP and goals domain

1. iep_cycles
2. iep_goals
3. goal_objectives
4. goal_measurement_definitions
5. goal_baselines
6. goal_data_points
7. goal_sessions
8. goal_intervention_phases
9. goal_status_history
10. progress_reporting_periods
11. progress_report_drafts
12. progress_report_finalizations
13. goal_attachments

### Behavior domain

1. behavior_definitions
2. replacement_behavior_definitions
3. behavior_events
4. behavior_abc_records
5. behavior_measurements
6. behavior_interventions
7. behavior_intervention_assignments
8. behavior_fidelity_records
9. behavior_plan_versions
10. fba_workspaces
11. behavior_safety_records, if authorized and carefully governed

### Intervention domain

1. interventions
2. intervention_assignments
3. intervention_sessions
4. intervention_fidelity_records
5. intervention_review_records
6. intervention_status_history

### Accommodations and services

1. accommodations
2. student_accommodations
3. accommodation_implementation_records
4. service_definitions
5. student_services
6. service_sessions
7. service_variances

### Communication and meetings

1. family_contacts
2. communication_templates
3. communication_follow_ups
4. meetings
5. meeting_participants
6. meeting_agenda_items
7. meeting_notes
8. meeting_tasks

### Files and reporting

1. attachments
2. report_definitions
3. generated_reports
4. export_events
5. report_snapshots

### Governance

1. audit_events
2. record_comments
3. notifications
4. tasks
5. feature_flags
6. organization_settings
7. retention_policies
8. consent or acknowledgment records where required

## Relationships

High-level relationship rules:

1. Organizations own schools, programs, settings, and memberships.
2. Students are organization-scoped and may have school, program, and classroom assignments.
3. Staff authorization flows through memberships and assignments, not a single global role.
4. Goals, behavior definitions, interventions, accommodations, and services attach to students within organization scope.
5. Data points and ABC records attach to definitions or goals and retain collector, timestamp, and status metadata.
6. Reports and exports reference source evidence and actor identity.
7. Audit events reference actor, organization, subject, action, and timestamp.

## Identifier Strategy

Planned approach:

1. Use opaque UUIDs as primary keys for application entities.
2. Do not expose sequential identifiers as the sole external reference for sensitive records.
3. Keep organization_id on protected tables directly or through enforced relational paths.
4. Prefer stable IDs that survive archival and status changes.

Final ID conventions will be confirmed when migrations begin.

## Organization Scoping

1. Every protected table must be tenant-isolatable.
2. Queries and policies must validate organization membership and assignment scope.
3. Cross-tenant joins must be impossible through ordinary application workflows.

## Status History

Important status changes should retain history rather than overwriting previous state without traceability.

Examples:

1. Goal status history
2. Student status history
3. Intervention status history
4. Report draft versus finalized transitions

## Soft Deletion

Protected educational records should generally use controlled archival or soft-deletion patterns rather than immediate hard deletion.

Deletion must eventually distinguish:

1. User correction
2. Soft deletion
3. Archival
4. Legal retention
5. Organization offboarding
6. Permanent deletion where authorized

## Audit Requirements

Significant actions must be auditable. Audit history should be tamper-resistant and not editable through ordinary application workflows.

See `AUDIT_AND_RETENTION.md`.

## Derived Data

Avoid storing derived analytics redundantly unless justified by:

1. Performance requirements
2. Auditability
3. Report snapshot immutability

When derived values are stored, record calculation method and timestamp.

## Time and Date Handling

Future implementation must use:

1. UTC for stored timestamps where appropriate
2. Organization or user timezone for display
3. Explicit date-only types for date-only educational fields
4. Clear handling of academic years
5. Clear handling of reporting periods

## Future Migration Rules

1. All database changes must be implemented through version-controlled migrations.
2. Do not make undocumented production schema changes through the Supabase dashboard.
3. Migrations must be reviewable, reversible where practical, and tested.
4. RLS policies are part of schema governance and must be migrated with tables.

## RLS Design Principles

1. Enable RLS for all exposed tables containing protected or tenant-specific data.
2. Do not create permissive placeholder policies such as `USING (true)` or `WITH CHECK (true)` for protected tables.
3. Policies must encode organization and assignment checks.
4. Do not use the Supabase service-role key in browser code.
5. Privileged operations must occur through secure server-side paths.

## Database Naming Conventions

Planned conventions:

1. snake_case table and column names
2. Plural table names for entity collections
3. `_id` suffix for foreign keys
4. `_at` suffix for timestamps
5. Clear status enums or constrained text values
6. Avoid ambiguous abbreviations

## Core Requirements

1. Organization-scoped multi-tenancy
2. Assignment-based authorization data
3. Raw evidence preservation for analytics source tables
4. Soft deletion and status history support
5. Version-controlled schema evolution

## Out of Scope

1. SQL DDL in Phase 0
2. Seed data execution
3. Generated database types
4. Production Supabase project configuration

## Open Questions

1. Should programs exist independently of schools, or always under a school?
2. Are classrooms and service teams one abstraction or separate entities?
3. How should historical enrollments be retained after school transfers?
4. What student identifiers are educationally necessary versus privacy-minimizing?
5. Should report snapshots store rendered documents, structured evidence packages, or both?

## Change History

| Date       | Change                | Author       |
| ---------- | --------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
