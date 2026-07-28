# Master Product Specification

## Purpose

Define the product identity, audience, problem statement, principles, modules, workflows, differentiators, boundaries, and success criteria for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

This document governs product intent for all phases. Implementation must remain consistent with this specification unless the product owner authorizes a change.

## Product Identity

**Product name:** SLC Intelligence

**Meaning of SLC:** Specialized Learning Classroom

**Public tagline:** The Intelligence Platform for Specialized Learning Classrooms

**Expanded market description:** SLC Intelligence is a special education operations, progress-monitoring, behavior analytics, documentation, communication, and decision-support platform for Specialized Learning Classrooms, intervention specialists, special education teachers, paraprofessionals, related service providers, building administrators, special education administrators, district-level special education programs, school districts, and educational organizations.

The platform is not limited to one classroom model. It must support intervention specialists, classroom teams, buildings, programs, and district-level leadership.

**Primary internal dashboard:** Command Center

**Flagship behavior module:** Behavior Detective

## Audience

Primary users:

1. Intervention specialists
2. Special education teachers
3. Classroom staff and paraprofessionals
4. Related service providers
5. Building administrators
6. Special education administrators
7. Organization and district administrators

Deferred audiences:

1. Parents and guardians (portal deferred)
2. Students (portal deferred)

## Problem Statement

Special education teams often document progress, behavior, interventions, accommodations, services, and communication across disconnected tools. Duplicate entry increases workload, weakens evidence quality, and makes it harder to produce defensible, understandable, actionable information for instruction and IEP team decisions.

SLC Intelligence must reduce fragmented documentation and turn classroom data into evidence that supports professional judgment without replacing the IEP team or other qualified decision-makers.

## Product Principles

1. **One-entry architecture** — Enter information once; reuse only where authorized and educationally appropriate.
2. **Evidence before interpretation** — Distinguish recorded facts, calculations, data-quality concerns, pattern indicators, decision-support suggestions, and formal decisions.
3. **Human decision authority** — Support professional judgment; do not replace IEP teams or qualified professionals.
4. **Data minimization** — Collect only information with a clear educational, operational, reporting, security, or legal purpose.
5. **Privacy by design** — Tenant isolation, role permissions, auditability, and secure defaults are architectural requirements.
6. **Accessibility by design** — Accessibility is built into components, forms, tables, charts, dialogs, reports, and testing from the beginning.
7. **Transparent analytics** — Analytic results must be explainable.
8. **No student ranking** — No leaderboards or competitive student rankings.
9. **Educator-centered usability** — Support rapid, mobile-responsive, keyboard-friendly classroom workflows.
10. **Maintainability** — Prefer understandable, modular, typed, tested code.

## Major Modules

Planned branded modules:

1. Command Center
2. Student Profiles
3. IEP Intelligence
4. Progress Monitoring
5. Behavior Detective
6. Intervention Intelligence
7. Executive Function Center
8. Family Communication
9. Meeting Center
10. Service Documentation
11. Accommodations Center
12. Staff Coordination
13. Reports and Exports
14. Administrative Intelligence
15. Data Quality Center

Do not add trademark symbols automatically in the user interface.

## Key Workflows

### Progress monitoring

A progress-monitoring entry may update an IEP goal graph, current performance calculations, data-quality indicators, progress-report readiness, instructional decision-support indicators, the student dashboard, and authorized administrative summaries.

### Behavior documentation

A behavior entry may update ABC documentation, frequency, duration or intensity trends, trigger and setting patterns, intervention response, replacement behavior data, FBA-supporting summaries, and authorized parent or administrator reports.

### Shared source of truth

Architecture must maintain shared truth for organizations, schools, programs, classrooms, staff, students, assignments, IEP goals, interventions, behavior definitions, accommodations, services, reports, permissions, and audit history.

## Differentiators

1. Special-education-authentic workflows rather than generic edtech assumptions
2. Measurement-system-aware IEP analytics that preserve raw evidence
3. Transparent data-quality analysis before interpretation
4. Behavior analytics that remain observational and non-diagnostic
5. Careful decision-support language with human authority preserved
6. Multi-tenant security with membership- and assignment-based authorization
7. Accessibility and privacy treated as first-class product requirements

## Non-Goals

1. Autonomous IEP writing
2. Automatic disability diagnosis
3. Automatic eligibility, placement, or service decisions
4. Automatic determination of behavior function
5. Employee surveillance or simplistic teacher-performance scoring
6. Student leaderboards or competitive rankings
7. Medicaid billing in the initial release
8. Parent or student portals in the initial release
9. Native mobile applications in the initial release
10. Full SIS replacement or full IEP-authoring replacement

## Initial-Release Boundaries

Excluded unless expressly approved later:

1. Parent portal
2. Student portal
3. Native iOS application
4. Native Android application
5. Medicaid billing
6. Transportation management
7. Full SIS integration
8. Full IEP-authoring replacement
9. Automated disability diagnosis
10. Automated placement recommendations
11. Automated restraint or seclusion recommendations
12. Facial recognition
13. Audio surveillance
14. Employee performance scoring
15. Public student profiles
16. Open social features
17. Student leaderboards
18. Automated disciplinary recommendations
19. Predictive risk labeling without an approved ethical framework
20. Biometric data collection

## Success Criteria

Phase-independent product success criteria:

1. Educators can enter progress and behavior data once and reuse it across authorized views.
2. Analytics clearly separate evidence, calculations, limitations, and professional decisions.
3. Authorization prevents access outside membership and assignment scope.
4. Reports are scoped, explainable, accessible, and export-logged.
5. The product remains usable in real classroom conditions, including rapid and mobile-responsive entry.
6. No real student data is used outside an approved controlled process.

Phase 0 success criteria are listed in `PRODUCT_ROADMAP.md`.

## Product Terminology

Use terms defined in `GLOSSARY.md`. Prefer:

- SLC Intelligence (product name)
- Command Center (primary dashboard)
- Behavior Detective (behavior module)
- organization, school, program, classroom, caseload
- intervention specialist
- decision support (not autonomous decision)

## Core Requirements

1. Multi-tenant SaaS design
2. Separation of authentication and authorization
3. Server-side and RLS enforcement of permissions
4. Evidence-preserving analytics architecture
5. Accessibility targeting WCAG 2.2 Level AA where feasible
6. Fictional-data-only development until an approved pilot process exists

## Out of Scope for This Document

1. Final UI layouts
2. Final brand colors
3. SQL schema
4. Implementation tickets

## Open Questions

1. Which modules are mandatory for the first controlled pilot versus later releases?
2. What organization types will be supported first (single school, district, multi-district consortium)?
3. What external integrations, if any, are required before pilot?
4. What retention defaults should apply when organizations do not configure custom policies?

## Change History

| Date | Change | Author |
| --- | --- | --- |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
