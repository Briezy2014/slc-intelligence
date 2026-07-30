# Counsel Review Checklist — SLC Intelligence Privacy Package

**Status:** DRAFT FOR LEGAL COUNSEL REVIEW — NOT APPROVED  
**Version:** 2026-07-30

Use this checklist during review. Mark each item and return with the cover package.

## A. Public-facing documents

- [ ] Privacy notice accurately describes roles (district/organization vs platform operator)
- [ ] Privacy notice does **not** claim FERPA/HIPAA/SOC2 certification unless counsel authorizes
- [ ] Terms of use updated or confirmed sufficient for pilot / production
- [ ] Account-deletion process acceptable
- [ ] Cookie / session description acceptable (`slc_org_id`, auth cookies)

## B. Data processing / customer terms

- [ ] District/organization treated as education agency / data controller (or counsel-defined role)
- [ ] Platform operator obligations (security, subprocessors, breach notice) acceptable
- [ ] Subprocessor list process acceptable (hosting, auth, optional AI provider)
- [ ] Retention / deletion / export obligations acceptable
- [ ] International transfer language (if any) acceptable

## C. FERPA / education records

- [ ] Counsel opinion: when records in SLC are FERPA education records
- [ ] Counsel opinion: coded student IDs (`STU-###`) with/without name/DOB/address
- [ ] Counsel opinion: whether “no name/DOB/address” is sufficient de-identification for school operational use
- [ ] Directory information / consent / parental rights handling guidance
- [ ] Breach / unauthorized disclosure response expectations

## D. AI Assist

- [ ] Local (catalog) assist approved for production use
- [ ] Optional external model assist (`AI_API_KEY`) approved, restricted, or prohibited
- [ ] Required minimization rules for prompts (no full student dossiers)
- [ ] Vendor contract / training-use / retention requirements if model assist enabled

## E. Electronic acknowledgments / e-sign (communications)

- [ ] E-sign / e-acknowledgment for family communications approved for build
- [ ] ESIGN/UETA (or applicable state) approach acceptable for acknowledgment of receipt
- [ ] Clarify what e-sign **may** and **may not** replace (e.g., not IEP team consent unless counsel says otherwise)
- [ ] Retention of signature artifacts + audit trail acceptable
- [ ] Parent identity assurance level acceptable (email link vs in-person staff attestation)

## F. Operational readiness

- [ ] Pilot vs production recommendations
- [ ] Required staff training / acceptable-use policy
- [ ] Minimum security controls confirmed (RLS, MFA recommendation, admin approvals)
- [ ] Insurance / incident contacts (if counsel requires)

## Counsel sign-off

| Field               | Response                                    |
| ------------------- | ------------------------------------------- |
| Counsel             |                                             |
| Date                |                                             |
| Overall disposition | ☐ Approve pilot ☐ Approve production ☐ Hold |
| Conditions          |                                             |
