"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FormField } from "@/components/forms/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveStudentAction } from "@/lib/actions/students";
import type { Student } from "@/lib/supabase/types";

const GRADE_LEVELS = [
  "PreK",
  "K",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "Transition",
] as const;

export function StudentForm({
  organizationId,
  student,
}: {
  organizationId: string;
  student?: Student | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [gradeLevel, setGradeLevel] = useState(student?.grade_level ?? "");
  const [message, setMessage] = useState<{ tone: "success" | "danger"; text: string } | null>(null);

  return (
    <form
      key={student ? `${student.id}-${student.updated_at}` : "new-student"}
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        const formData = new FormData(event.currentTarget);
        formData.set("gradeLevel", gradeLevel);
        startTransition(async () => {
          const result = await saveStudentAction(formData);
          if (result.status === "success") {
            setMessage({
              tone: "success",
              text:
                result.message ??
                (gradeLevel ? `Student saved · grade ${gradeLevel}.` : "Student saved."),
            });
            router.refresh();
          } else {
            setMessage({
              tone: "danger",
              text: result.message ?? "Could not save student. Check the fields and try again.",
            });
          }
        });
      }}
    >
      <input type="hidden" name="organizationId" value={organizationId} />
      {student ? <input type="hidden" name="studentId" value={student.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="firstName" label="First name">
          <Input
            id="firstName"
            name="firstName"
            required
            placeholder="S1"
            defaultValue={student?.first_name ?? ""}
          />
        </FormField>
        <FormField id="lastName" label="Last name">
          <Input
            id="lastName"
            name="lastName"
            required
            placeholder="Student"
            defaultValue={student?.last_name ?? ""}
          />
        </FormField>
      </div>
      <FormField id="preferredName" label="Preferred name (optional)">
        <Input
          id="preferredName"
          name="preferredName"
          placeholder="S1"
          defaultValue={student?.preferred_name ?? ""}
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="localIdentifier"
          label="Student ID"
          description="Classroom-safe code (for example S1). Shown on lists and the student hub."
        >
          <Input
            id="localIdentifier"
            name="localIdentifier"
            required
            placeholder="S1"
            defaultValue={student?.local_identifier ?? ""}
          />
        </FormField>
        <FormField id="gradeLevel" label="Grade level">
          <Select
            id="gradeLevel"
            name="gradeLevel"
            value={gradeLevel}
            onChange={(event) => setGradeLevel(event.target.value)}
          >
            <option value="">Choose grade level</option>
            {GRADE_LEVELS.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
      <div className="border-border space-y-3 rounded-[var(--radius-md)] border p-4">
        <h3 className="font-semibold">Optional demographics</h3>
        <p className="text-muted text-sm">
          Leave blank for de-identified or practice students. These fields are optional.
        </p>
        <FormField id="dateOfBirth" label="Date of birth (optional)">
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            defaultValue={student?.date_of_birth ?? ""}
          />
        </FormField>
        <FormField id="addressLine1" label="Address line 1 (optional)">
          <Input
            id="addressLine1"
            name="addressLine1"
            defaultValue={student?.address_line1 ?? ""}
            placeholder="Street address"
          />
        </FormField>
        <FormField id="addressLine2" label="Address line 2 (optional)">
          <Input
            id="addressLine2"
            name="addressLine2"
            defaultValue={student?.address_line2 ?? ""}
            placeholder="Apt, suite, etc."
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField id="city" label="City (optional)">
            <Input id="city" name="city" defaultValue={student?.city ?? ""} />
          </FormField>
          <FormField id="state" label="State (optional)">
            <Input id="state" name="state" defaultValue={student?.state ?? ""} />
          </FormField>
          <FormField id="postalCode" label="ZIP (optional)">
            <Input id="postalCode" name="postalCode" defaultValue={student?.postal_code ?? ""} />
          </FormField>
        </div>
      </div>
      <FormField id="enrollmentStatus" label="Enrollment status">
        <Select
          id="enrollmentStatus"
          name="enrollmentStatus"
          defaultValue={student?.enrollment_status ?? "active"}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </Select>
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="startDate" label="Start date">
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={student?.start_date ?? ""}
          />
        </FormField>
        <FormField id="endDate" label="End date">
          <Input id="endDate" name="endDate" type="date" defaultValue={student?.end_date ?? ""} />
        </FormField>
      </div>
      <div className="border-border space-y-3 rounded-[var(--radius-md)] border p-4">
        <h3 className="font-semibold">Support plans</h3>
        <p className="text-muted text-sm">
          Staff caseload flags for IEP, Section 504, Gifted, and English learner (EL). These are
          organizational indicators, not legal determinations.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="hasIep" label="IEP">
            <Select id="hasIep" name="hasIep" defaultValue={student?.has_iep ? "true" : "false"}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </Select>
          </FormField>
          <FormField id="hasSection504" label="Section 504">
            <Select
              id="hasSection504"
              name="hasSection504"
              defaultValue={student?.has_section_504 ? "true" : "false"}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </Select>
          </FormField>
          <FormField id="hasGifted" label="Gifted">
            <Select
              id="hasGifted"
              name="hasGifted"
              defaultValue={student?.has_gifted ? "true" : "false"}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </Select>
          </FormField>
          <FormField id="hasEnglishLearner" label="English learner (EL)">
            <Select
              id="hasEnglishLearner"
              name="hasEnglishLearner"
              defaultValue={student?.has_english_learner ? "true" : "false"}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </Select>
          </FormField>
        </div>
        <FormField id="homeLanguage" label="Home language (optional)">
          <Input
            id="homeLanguage"
            name="homeLanguage"
            defaultValue={student?.home_language ?? ""}
            placeholder="Spanish, Arabic, etc."
          />
        </FormField>
        <FormField id="supportPlanNotes" label="Support plan notes (optional)">
          <Textarea
            id="supportPlanNotes"
            name="supportPlanNotes"
            defaultValue={student?.support_plan_notes ?? ""}
            placeholder="Brief caseload notes"
          />
        </FormField>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : student ? "Save student" : "Create student"}
      </Button>
      {message ? (
        <Alert title={message.tone === "success" ? "Saved" : "Could not save"} tone={message.tone}>
          {message.text}
        </Alert>
      ) : null}
    </form>
  );
}
