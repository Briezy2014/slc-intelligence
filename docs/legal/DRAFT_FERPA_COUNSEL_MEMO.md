# Draft FERPA / Coded Student Identifier Memo — For Counsel Opinion

**Status:** DRAFT ISSUE MEMO FOR LEGAL COUNSEL — NOT A LEGAL OPINION  
**Version:** 2026-07-30  
**From:** Product / engineering (non-attorney)  
**To:** Product Owner counsel  

---

## 1. Question presented

Product Owner asks:

> If we do **not** put FERPA-type identifiers in the system (legal name, date of birth, home address, etc.), and instead label students only by a number/code (for example `STU-1042` or `A`/`B`/`C`), can we legally operate SLC Intelligence as an everyday classroom tool?

Engineering requests counsel’s written opinion. **Engineering cannot confirm that coded labels make the system outside FERPA or otherwise “legal by workaround.”**

---

## 2. Factual product design options

### Option A — Full identifiers (typical SIS-linked model)
Store legal name and/or other direct identifiers.

### Option B — Coded operational IDs (proposed by Product Owner)
Store only:

- Organization-assigned code (e.g., `STU-1042`)  
- Operational fields needed for teaching (grade band, goals, progress scores, behavior notes, etc.)  
- **Do not store** legal name, DOB, home address, SSN  

Staff may keep a separate offline/roster mapping code → real student (outside or inside district systems).

### Option C — Demonstration / training only
Fictional students only; no real learners.

---

## 3. Why engineering does **not** treat Option B as an automatic FERPA escape

Please confirm/correct these concerns:

1. **School official use still looks like education-record processing**  
   If district staff use the Platform in their official capacity to track a real student’s progress/behavior/services, the content may still be an education record even if the on-screen label is a code.

2. **Re-identification / linkability**  
   If staff can readily link `STU-1042` to a real child (classroom roster, memory, parallel SIS ID), coded display may not equal de-identification.

3. **Indirect identifiers**  
   Combinations of grade, classroom, disability-related notes, service minutes, and rare characteristics can identify a student even without name/DOB/address.

4. **“Local identifier” fields are still identifiers**  
   A stable student number used by the school is commonly still personal information / education-record content.

5. **AI / exports / screenshots**  
   Coded IDs reduce casual exposure risk but do not remove Organization duties if records remain linkable.

---

## 4. What coded IDs *are* useful for (operationally)

Even if FERPA still applies, counsel may still recommend codes because they can:

1. Reduce shoulder-surfing / screenshot risk  
2. Reduce unnecessary AI prompt exposure  
3. Support safer demos and training  
4. Enforce minimization culture among staff  

That is a **risk-reduction practice**, not automatically a **legal exemption**.

---

## 5. Requested counsel opinions

Please answer yes/no/conditional for each:

| # | Question | Counsel answer |
|---|---|---|
| Q1 | If Organization staff use SLC daily for real students with **only coded IDs** (no name/DOB/address stored), does FERPA still generally apply to those records? | |
| Q2 | Does a code become non-identifying only if Organization maintains **no** re-identification key and data cannot reasonably identify a student? | |
| Q3 | May Product Owner market “no FERPA data stored” based on Option B? (Engineering recommends **no** unless counsel writes approved language.) | |
| Q4 | What minimum contract terms are required before real-student pilot? | |
| Q5 | Are electronic acknowledgments on family communications allowed if student is coded but parent identity is collected? | |
| Q6 | Should model-based AI Assist be disabled for any real-student pilot? | |

---

## 6. Engineering recommendation (non-legal)

Until counsel approves a real-student regime:

1. Use **demo/fictional students** for public demos  
2. Prefer coded IDs even in pilot for minimization  
3. Keep access-request approvals + least privilege  
4. Disable or tightly control external AI model assist for real-student data  
5. Do **not** claim “we’re not under FERPA because we use codes” in marketing or staff training unless counsel drafts that sentence  

---

## 7. Counsel response block

| Field | Response |
|---|---|
| Counsel / firm | |
| Date | |
| Opinion summary | |
| Approved operating mode | ☐ Demo only ☐ Coded real-student pilot ☐ Full identifiers allowed |
| Required conditions | |
| Approved public language (attach) | |
