# Decision-Support Guardrails

## Purpose

Define the difference between observations, calculations, indicators, hypotheses, recommendations, and formal decisions, and establish approved versus prohibited wording for SLC Intelligence analytics and reports.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Applies to IEP analytics, Behavior Detective, intervention summaries, administrative intelligence, reports, and any future AI drafting features.

## Evidence Hierarchy

| Level | Meaning | System role |
| --- | --- | --- |
| Observation / recorded fact | What was entered as data | Store and display accurately |
| Calculation | Deterministic result from recorded values | Compute and explain |
| Data-quality concern | Limitation in completeness, consistency, or recency | Flag before interpretation |
| Pattern indicator | Descriptive pattern within selected filters | Present observationally |
| Hypothesis | Possible explanation requiring professional review | Never auto-assert as fact |
| Decision-support indicator | Advisory review prompt | Suggest review, not mandate action |
| Formal decision | IEP team or qualified professional determination | Outside automated system authority |

## Approved Wording

Examples of acceptable language:

1. Four data points were recorded across three instructional sessions during the selected reporting period.
2. Current evidence is insufficient for a reliable reporting statement.
3. Progress appears below the current aim line for the selected date range.
4. Within the selected date range, 7 of 10 recorded incidents occurred during transitions.
5. Recorded criteria indicate possible mastery; team review recommended.
6. Additional data may be needed before drawing a reliable instructional conclusion.
7. Potential function hypotheses must be reviewed by qualified staff.

## Prohibited Wording

Examples of unacceptable language:

1. The behavior is attention-seeking.
2. Transitions caused the behavior.
3. Reduce services.
4. Change placement.
5. The student no longer qualifies.
6. Remove this accommodation.
7. Determine manifestation automatically from these data.
8. The teacher is ineffective based on these metrics.
9. This student ranks below peers.

## IEP-Team Authority

The platform supports professional judgment. It does not replace the IEP team, evaluation team, administrator, intervention specialist, psychologist, related service provider, parent, or other qualified decision-maker.

## FBA Limitations

The system may organize evidence and support hypothesis documentation entered or reviewed by qualified staff.

The system must not independently diagnose the function of behavior.

## Eligibility Limitations

The system must not determine disability category or eligibility.

## Placement Limitations

The system must not determine or recommend placement changes as an automated outcome.

## Service Limitations

The system must not automatically direct users to increase or reduce services.

## Discipline Limitations

The system must not produce automated disciplinary recommendations, manifestation determinations, or restraint or seclusion recommendations.

## Human-Review Requirements

Decision-support indicators and drafted report language require human review before finalization, export, or sending.

Future AI outputs, if authorized, must remain drafts until reviewed.

## Explainability Requirements

Where practical, users should understand:

1. Which records were used
2. Which date range was analyzed
3. Which calculation was applied
4. Whether records were excluded
5. Whether enough data exists
6. Whether the measurement method changed
7. What limitations apply

## Auditability Requirements

Finalizations, exports, permission changes, and significant analytic report generations should be auditable.

## Prohibited Automated Decisions

The platform must not automatically direct users to:

1. Change an IEP goal
2. Reduce services
3. Increase services
4. Change placement
5. Change eligibility
6. Determine manifestation
7. Determine behavior function
8. Determine disability category
9. Determine extended school year eligibility
10. Remove an accommodation

## Core Requirements

1. Separate evidence from interpretation
2. Keep language observational and advisory
3. Preserve human decision authority
4. Require explainability and auditability

## Out of Scope

1. Final statistical thresholds for indicators
2. Jurisdiction-specific legal decision trees
3. AI provider selection

## Open Questions

1. Which decision-support indicators are approved for the first analytics release?
2. Must every indicator display an explainability panel by default, or on demand?
3. Who may customize indicator wording at the organization level, if anyone?
4. How should conflicting indicators be prioritized in the Command Center?

## Change History

| Date | Change | Author |
| --- | --- | --- |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
