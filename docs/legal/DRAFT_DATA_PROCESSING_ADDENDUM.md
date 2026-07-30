# Draft Data Processing Addendum (DPA) / Data Terms — SLC Intelligence

**Status:** DRAFT FOR LEGAL COUNSEL REVIEW — NOT APPROVED  
**Version:** 2026-07-30  
**Intended use:** Attach to Organization agreement / order form after counsel edit

---

## 1. Parties and roles

1. **Organization** — school, district, or education agency authorizing use.  
2. **Operator** — provider of the SLC Intelligence Platform.

Counsel should designate controller/processor (or FERPA “school official” / “service provider”) roles appropriate to the jurisdiction and contracting model.

## 2. Purpose of processing

Operator processes Organization Data solely to provide the Platform, including:

1. Staff authentication and membership administration  
2. Student/caseload workflow records as entered by Organization users  
3. Progress, behavior, intervention, accommodation, service, meeting, and communication features  
4. Assistive document drafting and optional AI Assist  
5. Electronic acknowledgment / e-sign capture for communications (if enabled)  
6. Security, auditing, backup, and support  

## 3. Organization Data

“Organization Data” means data submitted to or generated in the Organization’s tenant, including staff accounts, student-related education records as entered, attachments/uploads, communication/e-sign artifacts, and audit logs associated with that tenant.

## 4. Organization responsibilities

Organization shall:

1. Determine lawfulness of collecting and entering student/family information  
2. Configure and approve user access (including access-request approvals)  
3. Instruct staff on acceptable use and minimization  
4. Decide whether to store legal names / DOB / addresses vs coded identifiers  
5. Handle parent/eligible student rights requests as required by law  
6. Not use the Platform for prohibited automated legal determinations  

## 5. Operator responsibilities

Operator shall:

1. Process Organization Data only on Organization instructions documented in the agreement and product configuration  
2. Implement administrative, technical, and physical safeguards appropriate to the sensitivity of education records  
3. Ensure personnel with access are bound by confidentiality obligations  
4. Provide breach/security incident notice to Organization without undue delay after confirmation (**notice timing: [COUNSEL TO SET, e.g., 72 hours]**)  
5. Assist Organization with reasonable deletion/export requests  
6. Not sell Organization Data  

## 6. Subprocessors

1. Operator may use subprocessors for hosting, authentication, email delivery, storage, and optional AI model inference.  
2. Current core categories: cloud application hosting, database/auth provider (Supabase), optional AI API provider when Organization/operator enables model assist.  
3. Operator will maintain a subprocessor list and provide notice of material changes as counsel requires.  

## 7. AI Assist processing

1. **Local assist** may process Organization Data inside the Platform without an external model.  
2. **Model assist** (only if enabled) may transmit minimized prompt fields to a contracted AI provider.  
3. Organization may require model assist to remain disabled.  
4. Operator will not use Organization Data to train public foundation models unless counsel expressly authorizes a provider contract that permits it (default: **not permitted**).  

## 8. Electronic acknowledgments / e-sign

If enabled:

1. Platform may store signature/acknowledgment artifacts and metadata for family communications.  
2. Organization determines when e-sign is appropriate and what legal effect it has under Organization policy.  
3. Unless counsel amends this section, e-sign is limited to communication acknowledgment/receipt workflows and is **not** automatic consent for IEP eligibility, placement, or similar formal IDEA procedures.

## 9. Security measures (summary)

Operator maintains controls that may include: encryption in transit, access control, tenant isolation / row-level security, audit logging, least-privilege operational access, vulnerability management, and backups. Details may be provided in a security exhibit.

## 10. Retention and deletion

1. Organization Data is retained for the subscription term and any legally required retention period Organization specifies.  
2. Upon termination, Operator will delete or return Organization Data within **[COUNSEL TO SET]** days, except limited records retained for security/legal compliance.  

## 11. International transfers

If data is stored/processed outside Organization’s country/state expectations, counsel should insert transfer mechanism language.

## 12. Audits

Upon reasonable notice, Operator will provide security documentation reasonably necessary for Organization vendor review (**scope/frequency: [COUNSEL TO SET]**).

## 13. Liability / insurance

**[COUNSEL TO COMPLETE]**

## 14. Order of precedence

If this DPA conflicts with marketing materials or in-app helper text, this DPA and the master agreement control after counsel approval.

---

**Counsel disposition:** ☐ Approved ☐ Approved with edits ☐ Rejected  
**Counsel initials / date:** ______________________
