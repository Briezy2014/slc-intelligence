# Counsel question: coded student IDs without name / DOB / address

**Asker:** Product owner, SLC Intelligence  
**Need:** Written opinion before any school puts real students into the product for daily use.

## Question

If the school **does not enter** student name, date of birth, address, SSN, or similar direct identifiers into SLC Intelligence, and instead labels each student only with an **internal code** (for example `STU-001` or `Student A`), **can the school and vendor legally treat that data as outside FERPA / education-record controls?**

## What we already believe (confirm or correct)

1. Omitting name/DOB/address **reduces** risk and may support a **de-identification / directory / school-controlled key** strategy.
2. It is **not** automatically “not FERPA” if the school (or anyone with authorized access) can still **re-identify** the student using a roster, SIS ID, or classroom knowledge.
3. Whether a coded ID is “personally identifiable information” under FERPA depends on **re-identification risk** and how the school uses the system, not only on what fields are blank in the UI.
4. Even with codes only, **access controls, agreements, subprocessors, and AI use** still need counsel-approved terms for school deployment.

## Please answer in writing

- [ ] Yes / No / It depends — with the controlling conditions.
- [ ] What must be true for coded IDs to be an acceptable school practice in Ohio / for our customers.
- [ ] What we must **never** claim in marketing or in-product copy.
- [ ] Whether family communications about a coded student still implicate FERPA when the family knows who the code is.

## Product owner takeaway (until counsel answers)

**Do not treat coded IDs as a green light for unsupervised real-student production use.** Use them as a **risk-reduction design**, get counsel sign-off, then proceed under approved agreements.
