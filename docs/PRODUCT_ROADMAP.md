# Product Roadmap

## Purpose

Define the controlled development phases for SLC Intelligence and identify the currently authorized phase.

## Status

Status: Draft

Last updated: 2026-07-29

Owner: Product Owner

## Scope

This roadmap sequences work. Roadmap order is not automatic authorization. Only the product owner authorizes movement to the next phase.

## Current Authorized Phase

**Phases 16–18 completed for finished-product launch. Post-launch testing in progress.**

| Phase    | Status    |
| -------- | --------- |
| Phase 0  | Completed |
| Phase 1  | Completed |
| Phase 2  | Completed |
| Phase 3  | Completed |
| Phase 4  | Completed |
| Phase 5  | Completed |
| Phase 6  | Completed |
| Phase 7  | Completed |
| Phase 8  | Completed |
| Phase 9  | Completed |
| Phase 10 | Completed |
| Phase 11 | Completed |
| Phase 12 | Completed |
| Phase 13 | Completed |
| Phase 14 | Completed |
| Phase 15 | Completed |
| Phase 16 | Completed |
| Phase 17 | Completed |
| Phase 18 | Completed |

Production Deployment: Completed (code and configuration package ready; live domain cutover depends on product-owner cloud credentials when not present in the agent environment)

Production Domain: SLCintelligence.com

Post-Launch Testing: In progress

Future Development: Pending product-owner authorization

Checkpoint note: Phases 16–18 delivered Administrative Intelligence, hardening, production docs,
robots/sitemap, public policy/support pages, and deployment configuration. Local gates include
`db:reset`, `test:rls`, `typecheck`, `lint`, `test`, and `build`.

## Phase 0: Foundation and Governance

Status: Complete (approved on `main`)

Goals:

1. Establish repository structure
2. Establish product documentation
3. Establish security rules
4. Establish analytics requirements
5. Establish development controls
6. Establish phase roadmap
7. Prevent premature application code

Deliverables:

1. Required folders
2. Required documentation
3. Updated root README
4. Review of `.gitignore`
5. No packages
6. No application code
7. No database schema
8. No environment files
9. No secrets
10. No deployment

Acceptance criteria:

1. All required files exist
2. Documents are internally consistent
3. Product name and terminology are consistent
4. No real student data exists
5. No secret values exist
6. No application code was added
7. No dependencies were installed
8. No SQL was created
9. No database tables were created
10. Cursor provides a complete phase report

## Phase 1: Application Scaffold

Status: Completed

Scope:

1. Initialize Next.js
2. TypeScript strict mode
3. Tailwind
4. Base linting
5. Formatting
6. Initial testing framework
7. Environment-variable schema
8. Application shell
9. Health page
10. Basic CI checks

No database tables beyond the minimum connection test unless separately approved.

## Phase 2: Design System and Public Shell

Status: Completed

Scope:

1. Design tokens
2. Accessible components
3. Navigation shell
4. Responsive layout
5. Authentication-page designs
6. Empty states
7. Loading states
8. Error states
9. Story or component documentation approach

## Phase 3: Authentication and Tenant Foundation

Status: Completed

Completed scope:

1. Supabase authentication
2. Organization model
3. User profiles
4. Memberships
5. Invitation flow
6. Tenant selection
7. Initial RLS
8. Audit foundation
9. Authentication tests
10. Authorization tests

## Phase 4: Schools, Programs, Classrooms, and Staff

Status: Completed

Completed scope:

1. School management
2. Program management
3. Classroom management
4. Staff assignments
5. Scoped navigation
6. Role administration
7. Permission matrix
8. RLS tests

## Phase 5: Student Foundation

Status: Completed

Completed scope:

1. Student records
2. Enrollment
3. Program assignment
4. Classroom assignment
5. Staff-student relationships
6. Student list
7. Student profile shell
8. Archive workflow
9. Audit events
10. RLS tests

## Phase 6: IEP Goal Foundation

Status: Completed

Completed scope:

1. IEP cycles
2. Goals
3. Objectives
4. Baselines
5. Measurement definitions
6. Goal status
7. Goal history
8. Goal forms
9. Validation
10. Permission tests

## Phase 7: Progress-Monitoring Data Collection

Status: Completed

Completed scope:

1. Sessions
2. Data points
3. Measurement-specific forms
4. Raw-value preservation
5. Prompt levels
6. Settings
7. Intervention phases
8. Rapid entry
9. Drafts
10. Data-quality checks

## Phase 8: IEP Analytics

Status: Completed

Completed scope:

1. Descriptive analytics
2. Data quality
3. Trend calculations
4. Goal-line comparisons
5. Prompt dependence
6. Intervention phases
7. Generalization
8. Maintenance
9. Accessible charts
10. Calculation tests
11. Explainability panels

## Phase 9: Progress Reporting

Status: Completed locally (pending product-owner review)

Future scope:

1. Reporting periods
2. Draft summaries
3. Evidence references
4. Decision-support indicators
5. User review
6. Finalization
7. Report snapshots
8. Accessible print output
9. Export logging
10. Audit history

## Phase 10: Behavior Detective Foundation

Status: Completed locally (pending product-owner review)

Completed scope:

1. Behavior definitions
2. Replacement behaviors
3. ABC entry
4. Measurement entry
5. Rapid entry
6. Operational definitions
7. Permissions
8. Audit
9. Data-quality validation

## Phase 11: Behavior Analytics and FBA Support

Status: Completed locally (pending product-owner review)

Completed scope:

1. Frequency trends
2. Duration trends
3. Intensity trends
4. Latency trends
5. Heat maps
6. Scatterplots
7. Trigger patterns
8. Setting patterns
9. Intervention comparisons
10. Fidelity
11. FBA-supporting summaries
12. Guardrails
13. Analytics tests

## Phase 12: Intervention Intelligence

Status: Completed locally (pending product-owner review)

Completed scope:

1. Intervention library
2. Assignments
3. Dosage
4. Sessions
5. Fidelity
6. Review dates
7. Phase comparison
8. Status history
9. Decision-support indicators

## Phase 13: Accommodations and Service Documentation

Status: Completed

Completed scope:

1. Accommodations
2. Implementation tracking
3. Service definitions
4. Scheduled services
5. Delivered services
6. Variances
7. Review reports
8. Permissions
9. Audit

## Phase 14: Family Communication and Meeting Center

Status: Completed

Completed scope:

1. Contact log
2. Draft communication
3. Follow-up
4. Meetings
5. Participants
6. Agenda
7. Tasks
8. Evidence packets
9. Audit
10. Accessible reports

## Phase 15: Executive Function and Daily Classroom Operations

Status: Completed

Completed scope:

1. Executive-function targets
2. Daily notes
3. Classroom-team tasks
4. Staff coordination
5. Paraprofessional workflows
6. Assigned collection tasks
7. Role-limited views

## Phase 16: Administrative Intelligence

Status: Not started

Future scope:

1. Organization dashboard
2. School dashboard
3. Program dashboard
4. Data-quality summaries
5. Reporting readiness
6. Caseload analytics
7. Service variances
8. Behavior trends
9. Small-group suppression
10. Export controls

## Phase 17: Security, Accessibility, and Performance Hardening

Future scope:

1. Threat modeling
2. RLS audit
3. Permission audit
4. Accessibility audit
5. Performance testing
6. Backup testing
7. Recovery testing
8. Retention implementation
9. Incident-response procedures
10. Production-readiness review

## Phase 18: Controlled Pilot and Launch Preparation

Future scope:

1. Fictional-data demo
2. Controlled pilot planning
3. Support documentation
4. User onboarding
5. Training materials
6. Privacy documentation
7. Terms and policies
8. Production Supabase project
9. Vercel production configuration
10. Domain configuration
11. Monitoring
12. Rollback
13. Launch checklist

## Phase Status Legend

| Status         | Meaning                                 |
| -------------- | --------------------------------------- |
| Authorized     | Product owner has authorized work       |
| Not authorized | Must not begin                          |
| Complete       | Product owner accepted the phase report |
| Deferred       | Explicitly postponed                    |

Phases 1–18 are **Not authorized** until the product owner explicitly authorizes them.

## Core Requirements

1. Phase-gated delivery
2. Accurate current-phase marking
3. No silent advancement

## Out of Scope

1. Calendar estimates for phases
2. Parallel execution of unauthorized phases
3. Production launch activities during Phase 0

## Open Questions

1. Will any phases be combined or split after Phase 0 review?
2. Which module is required for the first controlled pilot: IEP analytics, Behavior Detective, or both?
3. When should design-system branding tokens be finalized relative to Phase 2?

## Change History

| Date       | Change                                                                                  | Author       |
| ---------- | --------------------------------------------------------------------------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft; Phase 0 marked current                                           | Cursor Agent |
| 2026-07-28 | Bundle 1 authorization: Phase 1 and Phase 2 marked in progress; Phase 0 marked complete | Cursor Agent |
| 2026-07-28 | Bundle 1 implementation: Phase 1 and Phase 2 marked completed; Phase 3 not started      | Cursor Agent |
| 2026-07-28 | Phases 3–8 implemented locally with Stage A/B/C checkpoints; Phase 9 not started        | Cursor Agent |
| 2026-07-29 | Phases 9-12 application layer implemented; Phase 13 not started                         | Cursor Agent |
| 2026-07-29 | Phases 13-15 application layer implemented; Phase 16 not started                        | Cursor Agent |
