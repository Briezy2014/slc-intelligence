# Learning progressions and education documents

## Learning progressions

Goals can be selected by:

1. Grade level (PreK–12 + Transition)
2. Course subject:
   - ELA · Reading
   - ELA · Writing
   - Mathematics
   - Functional mathematics
   - Science
   - Social studies
   - Executive function
   - Communication
   - Communication · ASL
   - General life skills
3. A generated progression goal for that grade/subject

When a goal is marked **Mastered · ready for next progression**, the form suggests the next ladder step (usually the same skill in the next grade band).

## IEP / ETR / Progress document workspace

Routes:

- `/education-documents` (tabs: IEP, ETR, Progress reports)
- `/students/[studentId]/iep`
- `/students/[studentId]/etr`

Capabilities:

1. Blank templates with dropdown and text sections
2. Prefill student name / grade / local ID
3. Save draft records for team review
4. Record upload metadata for existing IEP/ETR files

## Legal / compliance boundary

These tools assist educators and IEP teams. They do **not** automatically produce a legally controlling IEP, ETR, or progress report. District procedures, required participants, and authorized signatures remain required.

Apply migration:

`supabase/migrations/202607300011_education_documents.sql`
