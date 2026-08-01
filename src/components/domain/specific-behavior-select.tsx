"use client";

import { FormField } from "@/components/forms/form-field";
import { Select } from "@/components/ui/select";
import { BEHAVIOR_DEFINITION_TEMPLATES } from "@/lib/catalogs/behavior-templates";

export function SpecificBehaviorSelect({
  id = "specificBehavior",
  value,
  onChange,
  label = "Specific behavior",
  required = false,
  helperText = "Pick a specific behavior from the list — no need to type it manually.",
}: {
  id?: string;
  value: string;
  onChange: (behaviorTemplateId: string) => void;
  label?: string;
  required?: boolean;
  helperText?: string;
}) {
  return (
    <FormField id={id} label={label} description={helperText}>
      <Select
        id={id}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Choose a specific behavior</option>
        {BEHAVIOR_DEFINITION_TEMPLATES.map((template) => (
          <option key={template.id} value={template.id}>
            {template.category} · {template.name}
          </option>
        ))}
      </Select>
    </FormField>
  );
}
