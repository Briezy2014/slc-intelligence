# Draft Spec — Electronic Acknowledgment / E-Sign for Communications

**Status:** IMPLEMENTED FOR RECEIPT ACKNOWLEDGMENT — counsel should still confirm legal effect for district use  
**Version:** 2026-07-30 (build enabled by product owner request)  
**Module:** Family Communication  
**SQL / app:** `supabase/migrations/202607300014_communication_esign.sql`, `/sign/communication/[token]`

---

## 1. Goal

Allow family-facing communications in SLC Intelligence to collect an **electronic acknowledgment / e-signature**, so staff can record that a parent/guardian reviewed or acknowledged a message.

Counsel must approve legal effect before engineering enables this in production.

---

## 2. In scope (proposed)

For records with visibility `family_visible` (and counsel-approved templates):

1. **Acknowledge receipt** (checkbox + typed name)
2. **Optional drawn signature** (stylus/mouse canvas) or typed signature block
3. Capture metadata:
   - communication_log_id
   - signer display name
   - signer email (optional)
   - signed_at (server timestamp)
   - method (`typed`, `drawn`, `staff_attested`)
   - user_agent / IP hash (if counsel approves)
   - evidence hash of displayed message body
4. Write immutable audit event: `communication.esign_captured`
5. Show signed badge on communication detail
6. Allow Organization admin export of signature packet (PDF/JSON) later phase

## 3. Out of scope unless counsel expands

1. IEP/ETR formal consent signatures
2. Prior Written Notice legal execution
3. Manifestation determination signatures
4. Multi-party IEP meeting signature packets
5. Notarization / government ID verification
6. Automatic legal enforceability claims in UI copy

**Default product rule:** e-sign here = communication acknowledgment, not IDEA consent.

---

## 4. UX copy rules (must stay true)

Allowed:

- “Acknowledge receipt”
- “Electronic acknowledgment”
- “Signed acknowledgment recorded”

Avoid unless counsel authorizes:

- “Legally binding IEP consent”
- “FERPA waiver”
- “Final parental consent to services/placement”

---

## 5. Data model (proposed)

Table `communication_acknowledgments`:

- id uuid pk
- organization_id uuid not null
- communication_log_id uuid not null
- signer_name text not null
- signer_email text null
- method text check in (`typed`,`drawn`,`staff_attested`)
- signature_text text null
- signature_svg_or_png_path text null
- content_hash text not null
- attested_by_user_id uuid null (when staff confirms in-person acknowledgment)
- created_at timestamptz not null

RLS: org-scoped; `communication.finalize` / admin manage to write; assigned readers to read.

## 6. Security / integrity

1. Hash the exact message body shown at signing time
2. Do not allow silent edit of signed communication body without creating a new version + invalidating old acknowledgment
3. Store signature artifact in private storage bucket
4. Audit every capture, view of signature artifact, and export

## 7. Identity assurance levels

Counsel chooses allowed modes:

| Mode                    | Description                                                     | Proposed default  |
| ----------------------- | --------------------------------------------------------------- | ----------------- |
| Staff-attested          | Parent signs on staff device; staff confirms identity in person | Allowed for pilot |
| Email magic link        | Parent opens secure link and acknowledges                       | Counsel decision  |
| Accounted parent portal | Parent login                                                    | Later phase       |

## 8. AI interaction

AI Assist may draft communication text, but **must not** auto-send or auto-sign. Human staff sends/presents; signer acknowledges.

## 9. Acceptance criteria (after counsel approval)

1. Staff can present a family-visible communication and capture acknowledgment
2. Signature/acknowledgment appears in UI with timestamp
3. Audit log contains capture event
4. Editing message after sign requires new version / re-ack
5. UI never claims IDEA consent unless counsel-approved copy is added

## 10. Counsel approval

| Item                                       | Decision                               |
| ------------------------------------------ | -------------------------------------- |
| Approve build of communications e-sign/ack | ☐ Yes ☐ Yes with changes ☐ No          |
| Allowed modes                              | ☐ staff-attested ☐ email link ☐ portal |
| Allowed legal characterization             |                                        |
| Conditions                                 |                                        |
| Counsel / date                             |                                        |
