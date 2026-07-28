# Glossary

## Purpose

Define shared product and technical terminology for SLC Intelligence so documentation and future implementation remain consistent.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Terms below are normative for product language unless the product owner approves changes.

## Terms

### SLC

Specialized Learning Classroom. In the product name, SLC Intelligence means the intelligence platform for Specialized Learning Classrooms and related special education teams and programs.

### Intervention specialist

An educator responsible for specially designed instruction, progress monitoring, and coordination of supports for assigned students. Often a primary user of Command Center, IEP Intelligence, and Behavior Detective.

### Organization

The top-level tenant boundary, such as a school district or educational organization account that owns schools, programs, users, and settings.

### School

A building or school site within an organization.

### Program

An organizational educational program structure that may span one or more schools or classrooms, such as a special education program grouping.

### Classroom

A classroom or instructional grouping used for assignment, scheduling context, and team coordination. Not every organization will use every hierarchy level.

### Caseload

The set of students assigned to a staff member for instruction, case management, or related services.

### IEP

Individualized Education Program. The platform supports documentation, monitoring, and decision support related to IEP goals and progress; it is not an autonomous IEP writer.

### Goal

An IEP goal or instructional target tracked in the system, including measurement definition and status history.

### Objective

A shorter-term or supporting target associated with a goal.

### Baseline

Recorded performance evidence captured before or at the start of an instructional or intervention comparison period.

### Data point

A single recorded measurement used for progress monitoring or related analysis. Raw values must be preserved.

### Session

An instructional or data-collection episode that may contain one or more data points.

### Measurement method

The defined method used to measure a goal or behavior, such as frequency, duration, percentage correct, or interval recording.

### Prompt level

The level of assistance provided during a trial or task, used to analyze independence and prompt dependence when captured.

### Generalization

Performance of a skill across settings, people, materials, or conditions beyond the original teaching context.

### Maintenance

Continued performance of a skill after intensive instruction or after criteria appear met.

### Intervention phase

A labeled period with defined instructional or behavior-support conditions used for comparison, such as baseline versus intervention.

### Fidelity

The degree to which an intervention or plan was implemented as intended, based on recorded implementation evidence.

### ABC data

Antecedent-Behavior-Consequence documentation describing what was observed before, during, and after a behavior incident.

### Replacement behavior

A defined alternative behavior taught or reinforced to meet an educational or behavioral support purpose related to a target behavior.

### FBA

Functional Behavior Assessment. The platform may support organization of evidence and professionally reviewed hypotheses; it must not independently diagnose behavior function.

### Decision support

Advisory indicators and summaries that help professionals review evidence. Decision support does not replace IEP team or qualified professional authority.

### Reporting period

A defined date range used for progress reporting or analytic summaries.

### RLS

Row Level Security. PostgreSQL policies that restrict which rows a database role can read or write.

### Tenant

An isolated customer boundary in the multi-tenant architecture, represented primarily by an organization.

### Audit event

A durable record of a significant action for accountability, such as create, update, archive, export, permission change, or finalization.

### Draft

A non-final record or report that remains editable and must be clearly labeled as draft.

### Finalized record

A record or report that has passed an authorized finalization step, is auditable, and should not be silently rewritten without history.

### Archived record

A record removed from ordinary active workflows through controlled archival while remaining authorization-scoped and recoverable according to policy.

## Additional Product Terms

### SLC Intelligence

The product name.

### Command Center

The primary internal dashboard.

### Behavior Detective

The flagship behavior module.

## Core Requirements

1. Use glossary terms consistently across docs and UI copy
2. Prefer observational, non-punitive language
3. Do not treat decision support as autonomous decision-making

## Out of Scope

1. Exhaustive special education legal glossary
2. Jurisdiction-specific statutory definitions beyond product usage

## Open Questions

1. Should “classroom” and “service team” be separate glossary terms with distinct authorization meaning?
2. What user-facing term should replace internal schema names like `goal_data_points`?
3. Are organization-configurable synonyms allowed for roles?

## Change History

| Date | Change | Author |
| --- | --- | --- |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
