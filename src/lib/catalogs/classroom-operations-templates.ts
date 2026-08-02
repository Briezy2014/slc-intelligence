/** Prefill libraries for Classroom Operations guided forms. */

export const CLASSROOM_SCHEDULE_TEMPLATES = [
  "Monday–Friday schedule",
  "AM half-day schedule",
  "PM half-day schedule",
  "Community / specials day",
] as const;

export const CLASSROOM_BLOCK_TEMPLATES = [
  { label: "Arrival / morning meeting", start: "08:15", end: "08:35", type: "arrival" },
  { label: "Literacy block", start: "08:35", end: "09:35", type: "instruction" },
  { label: "Related services / centers", start: "09:35", end: "10:20", type: "related_service" },
  { label: "Math block", start: "10:20", end: "11:20", type: "instruction" },
  { label: "Lunch", start: "11:20", end: "11:50", type: "lunch" },
  { label: "Recess / movement", start: "11:50", end: "12:15", type: "recess" },
  { label: "Social skills / EF practice", start: "12:15", end: "12:45", type: "instruction" },
  { label: "Specials", start: "12:45", end: "13:30", type: "instruction" },
  { label: "Independent work / centers", start: "13:30", end: "14:15", type: "instruction" },
  { label: "Dismissal", start: "14:30", end: "14:45", type: "dismissal" },
] as const;

export const CLASSROOM_ROUTINE_TEMPLATES = [
  {
    name: "Arrival routine",
    routineType: "arrival",
    steps:
      "1. Hang up bag\n2. Check-in / greeting\n3. Unpack materials\n4. Morning work or quiet start",
  },
  {
    name: "Transition routine",
    routineType: "transition",
    steps:
      "1. Clean up current materials\n2. Check visual schedule\n3. Move with timer/cue\n4. Ready body for next activity",
  },
  {
    name: "Dismissal routine",
    routineType: "dismissal",
    steps:
      "1. Pack folder/agenda\n2. Clean desk area\n3. Line up with belongings\n4. Wait for dismissal cue",
  },
  {
    name: "Bathroom / break routine",
    routineType: "other",
    steps: "1. Request break/help card\n2. Use bathroom/break area\n3. Return and rejoin class",
  },
] as const;

export const DAILY_NOTE_TEMPLATES = [
  "Had a strong work day. Stayed engaged with visual supports.",
  "Needed extra prompts for transitions; visual timer helped.",
  "Participated well in small-group instruction.",
  "Used break card appropriately and returned to work.",
  "Struggled with peer interaction during recess; practiced expected language.",
  "Completed most of the assigned work with adult support.",
  "Calm morning arrival. Ready for the day.",
] as const;
