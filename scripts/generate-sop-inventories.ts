import { writeFileSync } from "fs";
import {
  BEHAVIOR_ACTIVITY_OPTIONS,
  BEHAVIOR_ANTECEDENT_OPTIONS,
  BEHAVIOR_CONSEQUENCE_OPTIONS,
  BEHAVIOR_DEFINITION_TEMPLATES,
  BEHAVIOR_SETTING_OPTIONS,
  BEHAVIOR_TRY_NEXT_SUGGESTIONS,
} from "../src/lib/catalogs/behavior-templates";
import { COMMUNICATION_LANGUAGES } from "../src/lib/catalogs/communication-languages";
import { COMMUNICATION_TEMPLATES } from "../src/lib/catalogs/communication-templates";

function numbered(items: readonly string[]) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

const defs = BEHAVIOR_DEFINITION_TEMPLATES.map(
  (template, index) => `${index + 1}. ${template.category} · ${template.name}`,
).join("\n");

const templates = COMMUNICATION_TEMPLATES.map((template, index) => {
  const suffix =
    template.defaultVisibility !== "family_visible"
      ? ` *(default: ${template.defaultVisibility})*`
      : "";
  return `${index + 1}. ${template.name}${suffix}`;
}).join("\n");

const langs = COMMUNICATION_LANGUAGES.map(
  (language, index) => `${index + 1}. ${language.name} (${language.nativeName})`,
).join("\n");

const behaviorSop = `# SOP — Behavior Detective

**Audience:** Intervention specialists, special education teachers, paraprofessionals  
**Module path:** Behavior Detective (\`/behavior-detective\`) or student Behavior tab  
**Pilot rule:** Use student codes only (for example S1, S2, S3). Do not enter real names, initials, or other identifying information unless district/legal approval allows it.

---

## Purpose

Behavior Detective is used to:

1. Create clear behavior definitions  
2. Log observations (ABC, frequency, duration, latency, interval, intensity)  
3. Keep classroom behavior data consistent across staff  
4. Support later team review (not diagnosis or eligibility decisions)

---

## Part A — Create a behavior definition

1. Open **Behavior Detective**.
2. Choose **Focus student** (use coded student during pilot).
3. Optional: open **Suggested behavior definition** and choose a starter (full list below).
4. Review/edit:
   - Behavior name  
   - Operational definition  
   - Examples  
   - Nonexamples  
5. Save the definition.
6. Status is saved as **active** (default).

### Dropdown: Suggested behavior definition (${BEHAVIOR_DEFINITION_TEMPLATES.length} options)

Displayed as \`Category · Name\`:

${defs}

---

## Part B — Log a behavior observation

1. Choose **Student**.
2. Choose **Behavior definition** (must exist for that student).
3. Choose **Observation method** (full list below).
4. Choose **Status**: Draft or Finalized.
5. Choose **Setting** (full list below).
6. Choose **Activity** (full list below).
7. For ABC method:
   - Optional: insert an **Antecedent (A)** dropdown option, then edit free text  
   - Enter Behavior (B)  
   - Optional: insert a **Consequence (C)** dropdown option, then edit free text  
8. Complete any method-specific fields (frequency count, duration, latency, intervals, intensity).
9. Review **Try next** suggestions (guidance list; not a required dropdown).
10. Save observation.

---

## Complete dropdown inventories

### 1) Observation method (6 options)

1. ABC  
2. Frequency  
3. Duration  
4. Latency  
5. Interval  
6. Intensity  

### 2) Observation status (2 options in UI)

1. Draft  
2. Finalized  

### 3) Setting (${BEHAVIOR_SETTING_OPTIONS.length} options)

${numbered(BEHAVIOR_SETTING_OPTIONS)}

### 4) Activity (${BEHAVIOR_ACTIVITY_OPTIONS.length} options)

${numbered(BEHAVIOR_ACTIVITY_OPTIONS)}

### 5) Antecedent (A) insert options (${BEHAVIOR_ANTECEDENT_OPTIONS.length} options)

${numbered(BEHAVIOR_ANTECEDENT_OPTIONS)}

### 6) Consequence (C) insert options (${BEHAVIOR_CONSEQUENCE_OPTIONS.length} options)

${numbered(BEHAVIOR_CONSEQUENCE_OPTIONS)}

### 7) Interval recording method (shown only if method = Interval) (3 options)

1. Partial  
2. Whole  
3. Momentary  

### 8) Intensity level (shown only if method = Intensity)

Organization-configured list. Demo/seed levels commonly include:

1. Low  
2. Moderate  
3. High  

(Your organization may have different labels.)

### 9) Try-next suggestions (${BEHAVIOR_TRY_NEXT_SUGGESTIONS.length} guidance items; displayed as suggestions, not a required select)

${numbered(BEHAVIOR_TRY_NEXT_SUGGESTIONS)}

---

## Paraprofessional quick checklist

1. Select coded student (S1, S2, S3…).  
2. Select the correct behavior definition.  
3. Choose method (usually ABC for classroom support notes).  
4. Choose Setting + Activity from the lists above.  
5. Use Antecedent/Consequence dropdowns when helpful, then edit for accuracy.  
6. Save as Draft unless your intervention specialist asks you to Finalize.  
7. Never enter real student names or parent-identifying details during the pilot.

---

## Guardrails

- Record observed facts, not diagnoses.  
- For sexualized/boundary behaviors, follow district reporting and supervision policy immediately; the dropdown supports accurate documentation, not delayed reporting.  
- Behavior Detective does not determine eligibility, placement, or manifestation outcomes.  
- Final educational decisions remain with the authorized team.
`;

const familySop = `# SOP — Family Communication (including multilingual drafting)

**Audience:** Intervention specialists, special education teachers, related service providers, paraprofessionals (as authorized)  
**Module path:** Family Communication (\`/family-communication\`)  
**Related:** Parent Share (\`/parent-share\`), receipt e-sign panel in Family Communication  
**Pilot rule:** Do not enter real parent names, emails, phones, or identifiable student information unless district/legal approval allows it.

---

## Purpose

Family Communication is used to:

1. Save contact records (when authorized)  
2. Draft and log school-to-home communications  
3. Choose a template + language  
4. Translate English drafts into a selected family language  
5. Request/capture parent **read receipt** (checkbox + typed name) with staff notification  
6. Optionally capture drawn signature

The app logs communications; it does **not** auto-send email/SMS. Staff deliver the message (email, letter, phone, text, etc.).

---

## Part A — Add a contact (authorized roles)

1. Open Family Communication.  
2. Choose **Student**.  
3. Enter First name, Last name, Relationship.  
4. Save contact.

> During the pilot, skip real parent contact info. Use practice/coded placeholders only if needed for workflow testing.

---

## Part B — Draft with Template & language

1. Open the **Template & language** tab.  
2. Choose a **Communication template** (full list below).  
3. Choose a **Language** (all 20 listed below).  
4. Enter a **Focus area** (for example: reading fluency, calm-down routine).  
5. Click **Insert template draft** (English draft inserts).  
6. If language is not English, click **Translate draft**.  
7. Always review the translated text (bilingual staff/interpreter review recommended).  
8. Switch to **Compose & save**.

---

## Part C — Compose & save

1. Confirm **Student** and optional **Contact**.  
2. Choose **Method** (full list below).  
3. Confirm **Language**.  
4. Choose **Visibility**:
   - Family visible (can go home / be shared)  
   - Internal (staff only)  
   - Restricted admin  
5. If family visible: choose **Request parent e-signature** Yes/No.  
6. Edit Subject and Message body.  
7. Save communication.

---

## Part D — Parent read acknowledgment + staff notification

1. In the e-sign panel, select the family-visible communication.  
2. Click **Create parent sign link** and send/print the link with the letter.  
3. Parent opens the link and:
   - Checks **I have read this**  
   - Types their name  
   - Clicks **Send acknowledgment to school**  
   - Optional: add a drawn signature  
4. Staff see an in-app notification under **Parent read / signature notifications**.  
5. Status moves to **signed** (receipt acknowledged).

This is **receipt acknowledgment only**, not IDEA/IEP consent.

---

## Complete dropdown inventories

### 1) Communication templates (${COMMUNICATION_TEMPLATES.length} options)

${templates}

### 2) Languages (${COMMUNICATION_LANGUAGES.length} options)

Displayed as \`English name (native name)\` in Template & language:

${langs}

### 3) Method (8 options)

1. Email  
2. Phone  
3. Text  
4. Letter  
5. In person  
6. Portal  
7. Video  
8. Other  

### 4) Visibility (3 options)

1. Family visible  
2. Internal  
3. Restricted admin  

### 5) Request parent e-signature (2 options; family-visible only)

1. Yes — request read/signature acknowledgment  
2. Not for this log  

### 6) Signature method — staff capture (3 options)

1. Drawn signature  
2. Typed acknowledgment  
3. Staff attested (in person / phone)  

### 7) Parent public acknowledgment options

1. Required: **I have read this** checkbox  
2. Required: type name + **Send acknowledgment to school**  
3. Optional: drawn signature  

### 8) E-sign status values shown in the communications table (4 options)

1. none  
2. pending  
3. signed  
4. clarification_requested  

### 9) Dynamic dropdowns (not fixed lists)

- **Student:** all students in your authorized scope  
- **Contact:** contacts saved for the selected student  
- **Family-visible communication (e-sign panel):** saved family-visible logs  

---

## Multilingual workflow (para/teacher friendly)

1. Write/select the message in English first.  
2. Choose the family’s language from the 20-language list.  
3. Click **Translate draft**.  
4. Have a bilingual staff member or interpreter review before sending home.  
5. Save the communication so it is trapped in the log.  
6. Create a parent sign link so the family can check **I have read this**, type their name, and send.

---

## Guardrails

- App records communications; staff deliver them.  
- Translation requires human review.  
- Parent read checkbox + typed name = receipt acknowledgment only (not IEP consent).  
- Staff notification is in-app (not automatic email/SMS to staff unless district configures email elsewhere).  
- During pilot: no real student/parent PII.
`;

writeFileSync("docs/SOP_BEHAVIOR_DETECTIVE.md", behaviorSop);
writeFileSync("docs/SOP_FAMILY_COMMUNICATION.md", familySop);

console.log({
  defs: BEHAVIOR_DEFINITION_TEMPLATES.length,
  settings: BEHAVIOR_SETTING_OPTIONS.length,
  activities: BEHAVIOR_ACTIVITY_OPTIONS.length,
  antecedents: BEHAVIOR_ANTECEDENT_OPTIONS.length,
  consequences: BEHAVIOR_CONSEQUENCE_OPTIONS.length,
  tryNext: BEHAVIOR_TRY_NEXT_SUGGESTIONS.length,
  templates: COMMUNICATION_TEMPLATES.length,
});
