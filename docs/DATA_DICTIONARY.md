# Data Dictionary

## Purpose

Provide a reusable data-dictionary template and fictional examples for documenting fields across SLC Intelligence domains.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

This document defines the dictionary format and includes illustrative fictional examples only. It is not an exhaustive schema catalog.

## Template Columns

Every data-dictionary entry should capture:

| Column | Description |
| --- | --- |
| Domain | Product domain (for example, IEP, Behavior, Tenancy) |
| Table | Planned table name |
| Field | Planned field name |
| User-facing label | Label shown in the interface |
| Definition | Meaning of the field |
| Data type | Planned type |
| Required status | Required, optional, conditionally required |
| Allowed values | Enumerations or constraints |
| Validation | Runtime and database validation expectations |
| Source | Who or what creates the value |
| User roles allowed to enter | Entry roles (assignment-scoped) |
| User roles allowed to view | View roles (assignment-scoped) |
| Sensitivity | Sensitivity classification |
| Export eligibility | Whether export may include the field |
| Analytics use | How analytics may use the field |
| Reporting use | How reports may use the field |
| Retention rule | Planned retention category |
| Audit requirement | Whether changes are audited |
| Notes | Additional guidance |

## Sensitivity Classes (Draft)

1. **Public product** — non-tenant marketing or product copy
2. **Operational** — organization configuration without student content
3. **Staff directory** — staff identity within tenant
4. **Educational record** — student educational information
5. **Sensitive educational record** — progress, behavior, services, communications
6. **Restricted safety** — safety documentation if authorized
7. **Secret** — credentials and keys; never stored in this dictionary as values

## Fictional Examples: IEP Goals

> All examples use fictional students and values. No real student information is permitted.

| Domain | Table | Field | User-facing label | Definition | Data type | Required status | Allowed values | Validation | Source | User roles allowed to enter | User roles allowed to view | Sensitivity | Export eligibility | Analytics use | Reporting use | Retention rule | Audit requirement | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| IEP | iep_goals | goal_statement | Goal statement | Observable annual goal description | text | Required | Free text with length limits | Non-empty; max length TBD | Intervention specialist entry | Intervention Specialist; SpEd Admin TBD | Assigned instructional and admin roles | Sensitive educational record | Yes, if authorized | Context only | Progress reports | Educational retention category | Yes | Avoid medical diagnosis language unless educationally required |
| IEP | goal_measurement_definitions | measurement_method | Measurement method | Method used to measure the goal | enum/text | Required | Approved measurement list | Must match supported methods | Goal setup | Intervention Specialist | Assigned roles | Educational record | Yes, if authorized | Selects calculation path | Explains metrics | Educational retention category | Yes | Changing method mid-goal must be historically visible |
| IEP | goal_baselines | baseline_value_raw | Baseline raw value | Raw baseline evidence payload | jsonb/structured | Required when baseline exists | Method-specific | Method-specific schema | Baseline entry | Intervention Specialist | Assigned roles | Sensitive educational record | Yes, if authorized | Baseline comparisons | Progress reports | Educational retention category | Yes | Example fictional payload: correct_responses=2, total_opportunities=10 |
| IEP | goal_data_points | correct_responses | Correct responses | Count of correct responses in the session | integer | Conditionally required | >= 0 | Must be <= total_opportunities | Session entry | Intervention Specialist; Paraprofessional if assigned | Assigned roles | Sensitive educational record | Yes, if authorized | Descriptive and trend analytics | Evidence tables | Educational retention category | Yes | Fictional example: 4 |
| IEP | goal_data_points | total_opportunities | Total opportunities | Count of opportunities presented | integer | Conditionally required | >= 1 when used | Required for percentage methods | Session entry | Intervention Specialist; Paraprofessional if assigned | Assigned roles | Sensitive educational record | Yes, if authorized | Rate and percentage calculations | Evidence tables | Educational retention category | Yes | Fictional example: 5 |
| IEP | goal_data_points | calculated_percentage | Calculated percentage | Derived percentage for display | numeric | Optional derived | 0–100 | Recalculable from raw values | System calculation | System | Assigned roles | Sensitive educational record | Yes, if authorized | Display convenience | Optional display | Same as source data point | Yes for overrides if ever allowed | Do not treat as sole source of truth |

## Fictional Examples: Behavior Data

| Domain | Table | Field | User-facing label | Definition | Data type | Required status | Allowed values | Validation | Source | User roles allowed to enter | User roles allowed to view | Sensitivity | Export eligibility | Analytics use | Reporting use | Retention rule | Audit requirement | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Behavior | behavior_definitions | operational_definition | Operational definition | Observable definition of the behavior | text | Required | Free text with length limits | Non-empty | Behavior setup | Intervention Specialist | Assigned roles | Sensitive educational record | Yes, if authorized | Context for patterns | Parent and admin reports | Educational retention category | Yes | Include examples and nonexamples in related fields |
| Behavior | behavior_abc_records | antecedent | Antecedent | What was observed immediately before the behavior | text/enum mix | Required | Organization-configurable catalog plus notes | Non-empty | ABC entry | Intervention Specialist; Paraprofessional if assigned | Assigned roles | Sensitive educational record | Scoped | Pattern counts | FBA-supporting summaries | Educational retention category | Yes | Fictional example: “Direction to begin independent worksheet” |
| Behavior | behavior_abc_records | observable_behavior | Observable behavior | What was observed | text | Required | Linked definition plus notes | Must match selected definition scope | ABC entry | Assigned data collectors | Assigned roles | Sensitive educational record | Scoped | Incident counts | Behavior reports | Educational retention category | Yes | Must remain observational |
| Behavior | behavior_abc_records | consequence_response | Consequence / response | What happened immediately after | text/enum mix | Required | Configurable catalog plus notes | Non-empty | ABC entry | Assigned data collectors | Assigned roles | Sensitive educational record | Scoped | Consequence patterns | FBA support | Educational retention category | Yes | Do not auto-label function |
| Behavior | behavior_measurements | duration_seconds | Duration (seconds) | Observed duration | integer | Conditionally required | >= 0 | Required for duration methods | Measurement entry | Assigned data collectors | Assigned roles | Sensitive educational record | Scoped | Duration trends | Evidence tables | Educational retention category | Yes | Fictional example: 90 |
| Behavior | fba_workspaces | function_hypothesis | Function hypothesis | Professionally entered hypothesis | text | Optional | Free text | Labeled as hypothesis | Qualified staff entry | Roles TBD by product owner | Restricted roles TBD | Sensitive educational record | Highly restricted | Not an automated conclusion | FBA packet only if authorized | Educational retention category | Yes | System must not generate this as a diagnosis |

## Reusable Blank Row

Copy this blank row when extending the dictionary:

| Domain | Table | Field | User-facing label | Definition | Data type | Required status | Allowed values | Validation | Source | User roles allowed to enter | User roles allowed to view | Sensitivity | Export eligibility | Analytics use | Reporting use | Retention rule | Audit requirement | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

## Core Requirements

1. Document sensitive fields before implementation.
2. Use fictional examples only.
3. Capture export, analytics, retention, and audit metadata.
4. Keep role guidance assignment-scoped.

## Out of Scope

1. Exhaustive field list for every future table
2. Final validation regexes
3. Production data values

## Open Questions

1. What organization-configurable controlled vocabularies are required for antecedents, settings, and consequences?
2. Which fields are mandatory for ABC completeness versus allowed as rapid-entry optional fields?
3. What sensitivity label should apply to family contact phone numbers and emails?
4. How granular should export eligibility flags be (field-level versus report-level)?

## Change History

| Date | Change | Author |
| --- | --- | --- |
| 2026-07-28 | Initial Phase 0 draft with fictional IEP and behavior examples | Cursor Agent |
