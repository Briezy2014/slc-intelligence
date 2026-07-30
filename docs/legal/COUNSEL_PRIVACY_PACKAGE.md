# Counsel Privacy Package — SLC Intelligence

**Status:** DRAFT FOR LEGAL COUNSEL REVIEW — NOT APPROVED  
**Version:** 2026-07-30  
**Product:** SLC Intelligence  
**Prepared for:** Product Owner counsel / education privacy counsel  
**Prepared by:** Product engineering (non-attorney draft)

---

## Purpose

This package is a **counsel-ready working set** so counsel can approve, edit, or reject:

1. Public privacy notice language
2. Organization / district data-processing terms
3. FERPA / education-record handling approach (including coded student identifiers)
4. Electronic acknowledgment / e-sign for family communications
5. AI Assist data-minimization rules

**This package is not legal advice and is not a certification of FERPA, IDEA, HIPAA, COPPA, SOC 2, or any other compliance framework.**

---

## Package contents

| Document                       | Path                                                | Counsel action                    |
| ------------------------------ | --------------------------------------------------- | --------------------------------- |
| Cover + package index          | `docs/legal/COUNSEL_PRIVACY_PACKAGE.md` (this file) | Approve package scope             |
| Review checklist               | `docs/legal/COUNSEL_REVIEW_CHECKLIST.md`            | Sign-off checklist                |
| Draft privacy notice           | `docs/legal/DRAFT_PRIVACY_NOTICE.md`                | Edit → replace public `/privacy`  |
| Draft data processing addendum | `docs/legal/DRAFT_DATA_PROCESSING_ADDENDUM.md`      | Edit → customer/district contract |
| FERPA / coded-ID counsel memo  | `docs/legal/DRAFT_FERPA_COUNSEL_MEMO.md`            | Answer open legal questions       |
| Short coded-ID question        | `docs/legal/COUNSEL_QUESTION_CODED_STUDENT_IDS.md`  | Written yes/no/depends opinion    |
| E-sign communications spec     | `docs/legal/DRAFT_ESIGN_COMMUNICATIONS_SPEC.md`     | Approve before engineering builds |

Related existing product docs (technical, not legal approval):

- `docs/SECURITY_AND_PRIVACY.md`
- `docs/AI_GOVERNANCE.md`
- `docs/AUTHENTICATION.md`
- `docs/AUDIT_AND_RETENTION.md` (if present)

---

## Product posture (for counsel)

SLC Intelligence is designed as an **authorized-staff educational workflow tool** for specialized learning classrooms:

- Organization-scoped tenancy + role-based access
- Admin approve/deny for new staff access requests
- Assistive drafting for IEP/ETR/progress language (**not** automatic legal determinations)
- Optional AI Assist with data-minimization expectations
- Proposed: electronic acknowledgment / e-sign on family-facing communications

The product owner intends everyday classroom use under district authority after counsel approval.

---

## Critical open question for counsel (student codes)

Product owner asks whether the system can avoid FERPA exposure by:

- **not storing** student legal name, DOB, home address, SSN, etc., and
- labeling students only as codes (e.g., `STU-1042`, `A`, `B`, `C`)

**Engineering does not affirm that this avoids FERPA.**  
See `DRAFT_FERPA_COUNSEL_MEMO.md` for the issue framing and requested counsel opinion.

---

## Proposed e-sign scope (communications)

Subject to counsel approval, engineering will implement electronic acknowledgment / e-sign capture for **family-facing communication records**, including:

- Acknowledgment of receipt
- Optional typed or drawn signature artifact
- Timestamp, signer identity (as provided), IP/user-agent metadata where appropriate
- Immutable audit event on capture

See `DRAFT_ESIGN_COMMUNICATIONS_SPEC.md`.

---

## What counsel should return

1. Redlined privacy notice (or approval as-is)
2. Redlined DPA / data terms (or approval as-is)
3. Written opinion on coded student identifiers vs FERPA
4. Approve / modify / reject e-sign for communications
5. Any required DPIA / district board / vendor-assessment steps

---

## Signature block (counsel)

| Item                     | Value                                         |
| ------------------------ | --------------------------------------------- |
| Counsel name / firm      |                                               |
| Date reviewed            |                                               |
| Package version reviewed | 2026-07-30                                    |
| Disposition              | ☐ Approved ☐ Approved with changes ☐ Rejected |
| Notes                    |                                               |
