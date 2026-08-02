/** Prefill libraries for Classroom Operations guided forms. */

export const CLASSROOM_SCHEDULE_TEMPLATES = [
  "Monday–Friday schedule",
  "AM half-day schedule",
  "PM half-day schedule",
  "Community / specials day",
  "Therapy-heavy day",
  "Shortened day / early release",
] as const;

export const CLASSROOM_BLOCK_TEMPLATES = [
  { label: "Arrival / morning meeting", start: "08:15", end: "08:35", type: "arrival" },
  { label: "Breakfast / snack", start: "08:35", end: "08:50", type: "instruction" },
  { label: "Literacy block", start: "08:50", end: "09:50", type: "instruction" },
  { label: "Related services / pull-out", start: "09:50", end: "10:30", type: "related_service" },
  { label: "Sensory / movement break", start: "10:30", end: "10:45", type: "recess" },
  { label: "Math block", start: "10:45", end: "11:45", type: "instruction" },
  { label: "Lunch", start: "11:45", end: "12:15", type: "lunch" },
  { label: "Recess / outdoor", start: "12:15", end: "12:40", type: "recess" },
  { label: "Social skills / EF practice", start: "12:40", end: "13:10", type: "instruction" },
  { label: "Specials (art / music / PE)", start: "13:10", end: "13:55", type: "instruction" },
  { label: "Independent work / centers", start: "13:55", end: "14:30", type: "instruction" },
  { label: "Pack-up / agenda", start: "14:30", end: "14:40", type: "dismissal" },
  { label: "Dismissal", start: "14:40", end: "14:55", type: "dismissal" },
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
  {
    name: "Center rotation routine",
    routineType: "transition",
    steps:
      "1. Hear clean-up cue\n2. Put materials away\n3. Check next center visual\n4. Move and start next task",
  },
  {
    name: "Calm-down / reset routine",
    routineType: "other",
    steps:
      "1. Move to calm space\n2. Use chosen regulation tool\n3. Check-in with adult when ready\n4. Return to class schedule",
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
  "Needed help starting tasks; first/then board helped.",
  "Showed kindness / helping behavior with a peer.",
  "Had difficulty with unexpected change; recovered with support.",
] as const;

export const CLASSROOM_ANNOUNCEMENT_TEMPLATES = [
  {
    title: "Schedule change today",
    body: "Today’s schedule has a change. Please check the posted visual schedule and support students through the updated transition times.",
  },
  {
    title: "Staff coverage note",
    body: "Coverage is in place for part of the day. Keep routines consistent and document any significant support needs.",
  },
  {
    title: "Specials / therapy reminder",
    body: "Reminder: related services or specials pull students at the usual time. Prepare materials before transitions.",
  },
  {
    title: "Family event / early dismissal",
    body: "Early dismissal or family event today. Begin pack-up earlier and confirm transportation plans before the end of day.",
  },
  {
    title: "Behavior / safety focus",
    body: "Today’s staff focus: calm transitions and clear expectations. Use visuals and prompt hierarchy before escalating support.",
  },
] as const;
