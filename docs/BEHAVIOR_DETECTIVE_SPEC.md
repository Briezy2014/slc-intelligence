# Behavior Detective Specification

## Purpose

Define requirements for the Behavior Detective module, including behavior definitions, ABC documentation, measurement, pattern analysis, replacement behaviors, intervention tracking, FBA support, reporting, and guardrails against unsupported causal or diagnostic claims.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Behavior Detective supports special education teams in collecting, organizing, and analyzing observational behavior data. It does not diagnose behavior function, disability, or disciplinary outcomes.

## Behavior Definitions

Phase 10 implemented behavior definitions, examples/nonexamples, replacement behavior definitions,
intensity scales, direct observations, correction history, and status history.

Each tracked behavior should support:

1. Clear label
2. Operational definition
3. Examples
4. Nonexamples
5. Measurement method
6. Start date
7. Status
8. Replacement behavior
9. Safety relevance
10. Authorized team notes

Operational definitions must be specific and observable. Prefer measurable descriptions over interpretive labels.

## ABC Data

Potential fields:

1. Student
2. Date
3. Start time
4. End time
5. Setting
6. Activity
7. Staff present
8. Antecedent
9. Observable behavior
10. Consequence or response
11. Duration
12. Frequency
13. Intensity
14. Latency
15. Replacement behavior
16. Intervention used
17. Outcome
18. Fidelity
19. Injury or safety indicator
20. Narrative notes
21. Attachments where authorized
22. Data collector
23. Record status

Fields shown to a user must respect role and assignment scope.

## Measurement Types

Behavior Detective should plan support for:

1. Frequency
2. Rate
3. Duration
4. Latency
5. Intensity
6. Interval recording
7. Occurrence or nonoccurrence within defined periods
8. Replacement-behavior measurement
9. ABC narrative plus structured coding

Raw values must be preserved. Derived summaries may be calculated for display and reporting.

## Pattern Analysis

Potential analytics:

1. Time-of-day patterns
2. Day-of-week patterns
3. Setting patterns
4. Activity patterns
5. Antecedent patterns
6. Consequence patterns
7. Staff-context patterns
8. Duration trends
9. Frequency trends
10. Intensity trends
11. Latency trends
12. Replacement-behavior trends
13. Intervention-response patterns
14. Fidelity comparisons
15. Scatterplots
16. Heat maps
17. Co-occurrence summaries

### Acceptable language

> Within the selected date range, 7 of 10 recorded incidents occurred during transitions.

### Unacceptable language

> Transitions caused the behavior.

Pattern language must remain observational. Potential functions must be framed as hypotheses requiring professional review.

## Replacement Behaviors

Support:

1. Operational definition of replacement behavior
2. Linked target behavior
3. Measurement method
4. Instructional or support context
5. Trend summaries relative to target behavior when authorized

Do not imply that an increase in replacement behavior alone proves functional equivalence without professional interpretation.

## Intervention Tracking

Support:

1. Intervention definitions
2. Assignment to students or behavior plans
3. Start and end dates
4. Dosage and frequency when captured
5. Responsible staff
6. Response documentation
7. Review dates
8. Status history

## Fidelity

Fidelity records may capture whether planned steps were implemented as intended.

Fidelity summaries must:

1. Identify the planned steps
2. Identify recorded implementation
3. Identify missing fidelity data
4. Avoid equating low fidelity with staff blame in product language

## FBA Support

The future FBA-supporting feature may organize:

1. Operational definitions
2. Baseline summaries
3. ABC patterns
4. Setting-event patterns
5. Antecedent patterns
6. Consequence patterns
7. Replacement behaviors
8. Intervention history
9. Data limitations
10. Hypotheses entered or reviewed by qualified staff
11. Questions requiring additional observation

The system must not independently diagnose the function of behavior.

## Safety Documentation

Safety-event documentation may be supported only where authorized and carefully governed.

Requirements if enabled:

1. Explicit permission controls
2. Audit logging
3. Restricted export rules
4. Clear distinction from routine ABC data
5. Product-owner approval before implementation

## Parent Reports

Parent-friendly reports must:

1. Use plain language
2. Remain observational
3. Respect authorized scope
4. Avoid diagnostic or causal claims
5. Require appropriate review before finalization or export
6. Log exports

## Administrator Reports

Administrator reports must:

1. Respect building, program, and organization scope
2. Use aggregation and suppression safeguards where appropriate
3. Avoid student ranking
4. Avoid unsupported conclusions
5. Log access and exports according to policy

## Guardrails Against Causal or Diagnostic Claims

Behavior Detective must not:

1. Diagnose behavior function automatically
2. Diagnose a disability
3. Determine manifestation
4. Recommend restraint or seclusion
5. Produce automatic disciplinary recommendations
6. Present correlation as causation

Potential function statements, if ever supported as structured fields, must be labeled as hypotheses requiring qualified professional review.

## Data-Quality Requirements

Before interpreting patterns, flag or disclose:

1. Number of recorded incidents
2. Date-range coverage
3. Missing setting, activity, or antecedent fields
4. Measurement consistency
5. Observation duration completeness when required
6. Possible duplicate records
7. Whether enough data exist for the selected summary

## Testing Requirements

Future tests must cover:

1. Definition and ABC validation
2. Measurement calculations
3. Pattern summaries
4. Observational-language guardrails
5. Permission boundaries
6. Export logging
7. Accessibility of charts and tables
8. Safety-record restriction rules if enabled

## Core Requirements

1. Operational definitions before tracking
2. Raw evidence preservation
3. Observational analytics language
4. Human authority for FBA hypotheses and decisions
5. Role-scoped access and auditability

## Out of Scope

1. Automated functional diagnosis
2. Predictive risk labeling without an approved ethical framework
3. Biometric monitoring
4. Audio or video surveillance features
5. Parent or student portal behavior views in the initial release

## Open Questions

1. Which intensity scales, if any, will be standardized versus organization-configurable?
2. What minimum incident counts are required before displaying pattern summaries?
3. How should safety events relate to routine ABC records without over-collecting sensitive detail?
4. Which staff roles may enter versus finalize parent-facing behavior summaries?
5. What small-group suppression rules apply to administrator behavior aggregates?

## Change History

| Date       | Change                | Author       |
| ---------- | --------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
