import type { EfSkillTemplate } from "@/lib/catalogs/types";

function item(id: string, name: string, description: string): EfSkillTemplate {
  return { id, name, description };
}

const skills: Array<[string, string]> = [
  ["Task initiation", "Beginning a nonpreferred or multi-step task after a clear start cue."],
  ["Sustained attention", "Maintaining attention to an assigned task for an agreed interval."],
  ["Working memory supports", "Holding and using multi-step directions with external memory aids."],
  ["Organization of materials", "Locating, preparing, and returning needed materials."],
  ["Planning a multi-step task", "Breaking a task into ordered steps before starting."],
  ["Time awareness", "Using timers or schedules to pace work and transitions."],
  ["Prioritizing work", "Choosing what to complete first when multiple tasks are present."],
  ["Flexible shifting", "Switching between activities or strategies when the plan changes."],
  ["Emotional regulation for learning", "Using a regulation strategy so learning can continue."],
  ["Impulse control during instruction", "Waiting, raising hand, or using expected responses."],
  ["Goal-directed persistence", "Continuing a task after difficulty with taught strategies."],
  ["Self-monitoring accuracy", "Checking work against a checklist or model."],
  ["Self-monitoring on-task behavior", "Noticing and correcting off-task behavior with cues."],
  ["Homework / assignment tracking", "Recording and reviewing assignments with a planner system."],
  ["Pack-up / dismissal routine", "Completing end-of-period or end-of-day routines independently."],
  ["Arrival / morning routine", "Completing arrival steps with decreasing adult prompts."],
  ["Transition readiness", "Ending one activity and preparing for the next on time."],
  ["Help-seeking", "Requesting assistance before avoidance or escalation."],
  ["Problem-solving steps", "Using a taught problem-solving sequence when stuck."],
  ["Inhibit interruption", "Waiting for a turn to speak during instruction or group work."],
  ["Workspace readiness", "Clearing and arranging the workspace before instruction."],
  ["Digital organization", "Managing files, tabs, or learning platform materials."],
  ["Long-term project planning", "Using checkpoints for multi-day assignments."],
  ["Reflection after work", "Reviewing what worked and what to change next time."],
];

export const EF_SKILL_TEMPLATES: EfSkillTemplate[] = skills.map(([name, description], index) =>
  item(`ef-${index + 1}`, name, description),
);

export function getEfSkillTemplate(id: string): EfSkillTemplate | undefined {
  return EF_SKILL_TEMPLATES.find((template) => template.id === id);
}
