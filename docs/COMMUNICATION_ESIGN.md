# Communication e-sign (parent receipt acknowledgment)

**Status:** Implemented for family-visible communications  
**SQL:** `supabase/migrations/202607300014_communication_esign.sql`

## Purpose

Trap school-to-home communications (behavior letters, progress notes, etc.) and let a parent/guardian **acknowledge receipt with a signature**.

This is **receipt acknowledgment**, not IDEA/IEP consent.

## Staff workflow

1. Create a **family-visible** communication (letter/email/text/in-person).
2. Keep **Request parent e-signature** = Yes.
3. In **Trap communication + parent signature**:
   - **Create parent sign link** → copy URL into email/text/printed letter, or
   - **Capture signature now** on a staff device (drawn + typed name).
4. Communication table shows e-sign status: `none` / `pending` / `signed`.

## Parent workflow

Open `/sign/communication/<token>`, review the message, type name, optionally draw signature, confirm receipt.

## Integrity

- Content hash of subject + body stored with each acknowledgment
- Signed body cannot be silently rewritten; create a new communication instead
- Audit events: `communication.esign_link_created`, `communication.esign_captured`

## Limits

- App does not auto-send email/SMS; staff deliver the letter/link
- Not a substitute for formal IEP consent signature packets
- During coded/de-identified pilots, avoid putting real student PII in the message body
