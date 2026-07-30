# Communication e-sign (parent receipt acknowledgment)

**Status:** Implemented for family-visible communications  
**SQL:**

- `supabase/migrations/202607300014_communication_esign.sql`
- `supabase/migrations/202607300015_staff_notifications_parent_read.sql`

## Purpose

Trap school-to-home communications (behavior letters, progress notes, etc.) and let a parent/guardian **acknowledge that they read the message**.

This is **receipt acknowledgment**, not IDEA/IEP consent.

## Staff workflow

1. Create a **family-visible** communication (letter/email/text/in-person).
2. Keep **Request parent e-signature** = Yes.
3. In **Trap communication + parent signature**:
   - **Create parent sign link** → copy URL into email/text/printed letter, or
   - **Capture signature now** on a staff device (typed name and/or drawn).
4. Communication table shows e-sign status: `none` / `pending` / `signed`.
5. When a parent acknowledges, staff see an in-app item under **Parent read / signature notifications**.

## Parent workflow

Open `/sign/communication/<token>`, review the message, then:

1. Check **I have read this**
2. Type your name
3. Click **Send acknowledgment to school**
4. Optional: add a drawn signature

School staff are notified in the Family Communication notification queue.

## Integrity

- Content hash of subject + body stored with each acknowledgment
- Signed body cannot be silently rewritten; create a new communication instead
- Audit events: `communication.esign_link_created`, `communication.esign_captured`, `communication.notification_read`

## Limits

- App does not auto-send email/SMS; staff deliver the letter/link
- Staff notification is in-app (not automatic staff email)
- Not a substitute for formal IEP consent signature packets
- During coded/de-identified pilots, avoid putting real student PII in the message body
