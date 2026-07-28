# AI Governance

## Purpose

Define governance for deferred AI features in SLC Intelligence, including approved future use cases, prohibitions, human review, privacy controls, and evaluation requirements.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

AI features are deferred until core workflows, permissions, privacy, and data quality are stable.

Do not add AI packages or integrations during Phase 0.

## AI Features Are Deferred

No AI provider integration, model SDK, or automated generation feature is authorized in Phase 0 or early core workflow phases unless the product owner explicitly revises this policy.

## Approved Future Use Cases

Future AI may assist with:

1. Drafting parent communication
2. Summarizing recorded evidence
3. Drafting progress-report language
4. Organizing meeting preparation
5. Converting structured data into plain language
6. Identifying missing documentation
7. Suggesting questions for team review

## Prohibited Decisions

AI must not:

1. Diagnose a disability
2. Determine eligibility
3. Determine placement
4. Determine behavior function
5. Make disciplinary decisions
6. Replace an IEP team
7. Change services automatically
8. Change goals automatically
9. Produce final communications without user review
10. Receive student records through an unapproved provider

## Human Review

Any future AI output must require human review before sending or finalization.

## Provider Review

Before any AI provider is approved:

1. Document data flows
2. Confirm contractual and privacy review
3. Confirm that student records are not sent to unapproved systems
4. Confirm retention and training-use restrictions acceptable to the product owner

## Data Minimization

Prompts should include only the minimum data needed for the drafting or summarization task.

Prefer structured evidence references over pasting unnecessary narrative or identity details.

## Prompt and Output Logging Considerations

If prompts or outputs are logged:

1. Protect them as sensitive educational artifacts
2. Scope them to organization authorization
3. Avoid logging secrets
4. Define retention
5. Make auditability available for finalizations that used AI drafts

Exact logging policy is unresolved.

## Organization-Level Controls

Future AI features must support organization-level configuration, including the ability to disable AI features.

## Model-Evaluation Requirements

Before enabling AI in production-like environments:

1. Evaluate output quality on fictional scenarios
2. Evaluate refusal behavior for prohibited requests
3. Evaluate citation/evidence grounding
4. Evaluate accessibility of drafted content structures

## Bias and Hallucination Testing

Testing must look for:

1. Unsupported conclusions
2. Invented data points
3. Punitive or biased language
4. Omission of stated limitations
5. Inappropriate certainty

## Draft Labeling

AI outputs must be clearly labeled as drafts.

## Supporting Evidence

AI drafts should reference supporting recorded evidence and disclose when evidence is insufficient.

## User Feedback

Provide a path for users to flag incorrect, unsafe, or unhelpful AI drafts.

## Kill-Switch Requirement

A kill switch must allow rapid disablement of AI features at platform and organization levels.

## Core Requirements

1. AI is deferred
2. Human review is mandatory
3. No prohibited autonomous decisions
4. No unapproved student-data providers
5. Organization disable controls and kill switch

## Out of Scope

1. Model selection in Phase 0
2. Prompt engineering implementation
3. Customer-facing AI marketing claims

## Open Questions

1. When is the earliest phase AI drafting may be reconsidered?
2. Will AI run only on server-side approved providers with zero data retention for training?
3. May organizations bring their own approved enterprise AI endpoints?
4. How will AI draft provenance appear in finalized report audit history?

## Change History

| Date       | Change                             | Author       |
| ---------- | ---------------------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft; AI deferred | Cursor Agent |
