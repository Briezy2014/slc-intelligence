# Communication translation, acknowledgements, and support plans

**Status:** Implemented (requires SQL migration `202607300013_comms_translation_plans_district_forms.sql`)  
**Date:** 2026-07-30

## What shipped

### Family Communication — Template & language

- Dedicated **Template & language** tab in Family Communication
- Pick a starter communication template **and** one of **20 languages**
- Insert English draft, then **Translate draft** (AI Assist / model when `AI_API_KEY` is configured)
- Language code stored on the communication log; optional English `source_summary` retained

### Parent / guardian acknowledgement

- Staff can record typed or staff-attested acknowledgement on family-visible communications
- Intended for progress updates, behavior notes, and similar family messages
- Explicitly **not** IDEA/IEP consent or formal Prior Written Notice signature

### Student support plans

- Student profile flags: IEP, Section 504, Gifted, English learner (EL)
- Optional home language + support plan notes
- Organizational indicators only — not legal determinations

### Education documents — 504 / Gifted / EL + district blanks

- New document tabs: **504**, **Gifted**, **EL** (plus existing IEP / ETR / Progress)
- Upload **district blank official forms** as org-level master templates
- Continue to upload completed PDFs/images to auto-fill structured student drafts

## SQL to run in Supabase

Paste and run:

`supabase/migrations/202607300013_comms_translation_plans_district_forms.sql`

## Limits / honesty

1. Translation quality depends on AI Assist model configuration; bilingual review is required.
2. District blank templates assist drafting; they do not replace the district’s controlling legal PDF workflow or official e-signature packet systems.
3. Parent acknowledgement in-app is collaborative receipt capture for authorized staff workflows — not a parent portal and not a substitute for counsel-approved e-sign legal effect until counsel approves.
4. 504 / Gifted / EL modules are assistive drafts + caseload flags, not full state-form compliance engines.
