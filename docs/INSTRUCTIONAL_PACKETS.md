# Instructional packet generator

**Status:** Active student packet drafting  
**Route:** `/instructional-packets`

## Purpose

Generate **student-facing** instructional packets from a learner profile (grade, support needs, reading level, skill/IEP goals, preferred interests), then **Download as PDF** to print.

Example profile:

- Grade 7
- Moderate Autism
- Reading level: 2nd grade
- Skill goal: Identify U.S. coins
- IEP goal: Count combinations up to $5.00
- Preferred interests: Space

## Packet contents (student pages)

- Cover with theme + coin visuals
- Visual support cards (real SVG drawings in PDF)
- Simple step pages
- Cut-and-paste
- Games
- Practice pages
- Check-ups

Teacher “how to use this packet,” data sheets, and answer-key pages are **not** included in the printable packet.

## Download / print

1. Generate the packet.
2. Click **Download as PDF**.
3. In the print dialog, choose **Save as PDF** (or Microsoft Print to PDF).

Visual markers like `[[VISUAL:coin-penny]]` become drawings in the printable PDF.

## Generation modes

- Easy / Moderate / Challenging
- Errorless learning / Task analysis / ABA style / UDL style

Target length options: about 30, 40, 60, 80, or 100 pages.

## AI / ChatGPT

Instructional Packets use the **local visual generator** (works without an API key).

A **ChatGPT Plus subscription cannot be synced**. For stronger AI-written **worksheet** text, add an OpenAI **API key** (`AI_API_KEY`) per `docs/AI_API_KEY_SETUP.md` and use **Worksheet Generator**.
