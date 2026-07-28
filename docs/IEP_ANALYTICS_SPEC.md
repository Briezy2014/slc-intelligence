# IEP Analytics Specification

## Purpose

Define requirements for measurement-aware IEP progress analytics, data-quality analysis, trend analysis, decision-support language, explainability, and testing for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

This specification governs IEP Intelligence and Progress Monitoring analytics. It does not authorize automatic IEP, eligibility, placement, or service decisions.

## Measurement Systems

Plan support for:

1. Percentage correct
2. Correct responses out of total opportunities
3. Frequency
4. Rate
5. Duration
6. Latency
7. Partial-interval recording
8. Whole-interval recording
9. Momentary time sampling
10. Rubric score
11. Prompt level
12. Task-analysis steps
13. Curriculum-based measurement
14. Reading fluency
15. Reading accuracy
16. Trial-by-trial data
17. Work completion
18. Behavior occurrence
19. Replacement behavior
20. Independence level
21. Narrative observation
22. Rating scale
23. Checklist completion
24. Count within a defined period
25. Time on task

Not every measurement type must ship in the first analytics release. Implementation phases must declare which types are supported.

## Raw-Data Preservation

The data model must preserve raw values.

Example:

Do not store only `80%`.

Store:

- `correct_responses = 4`
- `total_opportunities = 5`
- `calculated_percentage = 80` (optional derived display value)

The application may calculate and display percentages, rates, or summaries, but raw evidence must remain available for audit, reporting, and recalculation.

## Data-Quality Rules

Before interpreting progress, calculate or flag:

1. Number of data points
2. Number of instructional sessions
3. Days since last collection
4. Data-collection frequency
5. Missing expected sessions
6. Date-range coverage
7. Measurement consistency
8. Baseline availability
9. Intervention-fidelity availability
10. Prompt-level availability
11. Settings represented
12. Staff represented
13. Task types represented
14. Whether the measurement method changed
15. Whether a denominator is missing
16. Whether observation duration is missing
17. Whether duplicate records may exist
18. Whether enough evidence exists for the selected interpretation

Example safe statement:

> Four data points were recorded across three instructional sessions during the selected reporting period. Additional data may be needed before drawing a reliable instructional conclusion.

Do not invent unapproved statistical thresholds during Phase 0. Thresholds require product-owner and educational-method approval.

## Descriptive Analytics

Depending on measurement type, support:

1. Baseline
2. Current performance
3. Mean
4. Median
5. Minimum
6. Maximum
7. Range
8. Total opportunities
9. Correct opportunities
10. Independent opportunities
11. Prompted opportunities
12. Prompt distribution
13. Frequency
14. Rate
15. Duration
16. Latency
17. Performance by setting
18. Performance by task
19. Performance by staff
20. Performance by intervention phase
21. Performance by accommodation condition
22. Variability
23. Data completeness

Do not display irrelevant metrics for a measurement type.

## Trend Analytics

Plan for:

1. Trend direction
2. Rate of improvement
3. Goal-line comparison
4. Aim-line comparison
5. Moving average
6. Percentage change from baseline
7. Variability
8. Consecutive increases
9. Consecutive decreases
10. Plateau indicators
11. Intervention-phase comparison
12. Maintenance
13. Generalization
14. Skill regression
15. Prompt fading
16. Independent-performance growth

Trend calculations must be tested and documented before production use.

## Goal-Line Concepts

Goal-line and aim-line comparisons must:

1. Identify the baseline value and date range
2. Identify the target criterion and target date when available
3. State the calculation method
4. State whether insufficient data prevents a reliable comparison
5. Avoid causal language about instructional effectiveness without phase and fidelity context

## Prompt-Dependence Analysis

When prompt-level data exist, analytics may summarize:

1. Distribution of prompt levels
2. Independent versus prompted opportunities
3. Changes in independence over time
4. Limitations when prompt data are incomplete

Language must remain descriptive. Do not diagnose learner characteristics from prompt patterns alone.

## Generalization

Support recording and summarizing performance across settings, materials, people, or task variations when those dimensions are captured.

Generalization summaries must identify which dimensions were compared and which were not measured.

## Maintenance

Support maintenance-phase identification and summaries after instructional criteria appear met.

Maintenance indicators must distinguish:

1. Insufficient maintenance data
2. Maintained performance within recorded criteria
3. Performance decline relative to prior recorded performance

## Intervention-Phase Comparisons

Comparisons may include baseline versus intervention and one intervention phase versus another.

Comparisons must:

1. Identify phase boundaries
2. Identify measurement consistency across phases
3. Identify potential confounds
4. Avoid implying causation from simple correlation

## Decision-Support Language

The platform may produce carefully worded review indicators such as:

1. Continue current instruction
2. Collect additional data before making a change
3. Review instructional intensity
4. Review implementation fidelity
5. Review prompt dependence
6. Consider additional generalization opportunities
7. Review measurement consistency
8. Team review recommended
9. Recorded criteria indicate possible mastery
10. Maintenance data recommended
11. Progress appears below the current aim line
12. Progress appears variable
13. Data are not recent enough for a current conclusion
14. Current evidence is insufficient for a reliable reporting statement

See `DECISION_SUPPORT_GUARDRAILS.md` for approved and prohibited wording.

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

These are team or qualified-professional decisions.

## Explainability

Every analytic summary should eventually identify:

1. Date range
2. Number of records
3. Measurement type
4. Calculation method
5. Missing-data limitations
6. Intervention phases
7. Whether prompted and independent trials were combined
8. Whether excluded records exist
9. Timestamp of calculation
10. User-selected filters

## Testing Requirements

Future tests must cover:

1. Raw-value preservation
2. Measurement-specific calculations
3. Data-quality flags
4. Trend calculations
5. Goal-line comparisons
6. Phase comparisons
7. Explainability metadata
8. Prohibited-output guardrails
9. Permission-scoped analytics visibility

## Reporting Requirements

Progress reports must:

1. Reference supporting evidence
2. Distinguish draft from finalized status
3. State limitations and missing data
4. Avoid unsupported conclusions
5. Remain accessible and print-friendly
6. Log exports and finalizations

## Core Requirements

1. Preserve raw evidence
2. Calculate data quality before interpretation
3. Use measurement-appropriate metrics only
4. Keep decision-support language advisory
5. Make every analytic result explainable

## Out of Scope

1. Unapproved statistical cut scores
2. Predictive disability or risk labeling
3. Autonomous report finalization
4. AI-generated final progress language without human review

## Open Questions

1. Which measurement types are required for the first analytics release?
2. What minimum data-point counts, if any, will be product-approved for specific indicators?
3. How should academic-year and reporting-period calendars be configured per organization?
4. How should measurement-method changes mid-goal be represented in graphs and summaries?
5. Which variability statistics are educationally appropriate for each measurement type?

## Change History

| Date       | Change                | Author       |
| ---------- | --------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
