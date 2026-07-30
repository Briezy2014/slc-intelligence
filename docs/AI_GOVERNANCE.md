# AI Governance

## Purpose

Define governance for AI Assist features in SLC Intelligence, including approved use cases, prohibitions, human review, privacy controls, and evaluation requirements.

## Status

Status: Active for assistive drafting (product-owner authorized)

Last updated: 2026-07-30

Owner: Product Owner

## Scope

AI Assist is authorized to help educators draft and rank suggestions for:

1. Family communication drafts
2. Accommodation language
3. Intervention plan suggestions
4. Goal drafting language
5. Executive function plan focuses
6. Progress-monitoring session prompts

AI Assist may use:

1. Local SLC intelligence (starter catalogs + ranking) without an external model
2. Optional model enrichment when `AI_API_KEY` is configured (OpenAI-compatible Chat Completions API)

## Kill switch

Set `AI_ASSIST_ENABLED=false` (or `NEXT_PUBLIC_AI_ASSIST_ENABLED=false`) to disable AI Assist platform-wide.

## Approved Use Cases

AI may assist with:

1. Drafting parent communication
2. Suggesting accommodations / interventions / EF focuses
3. Drafting progress-report or progress-session language
4. Organizing meeting preparation language
5. Converting structured context into plain language
6. Identifying missing documentation prompts
7. Suggesting questions for team review

## Prohibited Decisions

AI must not:

1. Diagnose a disability
2. Determine eligibility
3. Determine placement
4. Determine behavior function as a final conclusion
5. Make disciplinary decisions
6. Replace an IEP team
7. Change services automatically
8. Change goals automatically
9. Produce final communications without user review
10. Receive student records through an unapproved provider

## Human Review

Any AI output must require human review before sending or finalization.

All AI Assist outputs are labeled as drafts and include an educator-review disclaimer.

## Provider Review

Before enabling model assist with real student context:

1. Document data flows
2. Confirm contractual and privacy review
3. Confirm that student records are not sent to unapproved systems
4. Confirm retention and training-use restrictions acceptable to the product owner

Prefer minimized context fields (focus area / setting / need) over identifiers.

## Data Minimization

Prompts should include only the minimum data needed for the drafting or summarization task.

Prefer structured evidence references over pasting unnecessary narrative or identity details.

## Organization-Level Controls

Future AI features should support organization-level configuration, including the ability to disable AI features per organization. Platform kill switch is required now.

## Draft Labeling

AI outputs must be clearly labeled as drafts.

## Core Requirements

1. Human review is mandatory
2. No prohibited autonomous decisions
3. No unapproved student-data providers
4. Platform kill switch required
5. Local intelligence remains available when model keys are absent

## Change History

| Date       | Change                                                                 | Author       |
| ---------- | ---------------------------------------------------------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft; AI deferred                                     | Cursor Agent |
| 2026-07-30 | Product-owner authorized assistive drafting across core workflow tabs | Cursor Agent |
