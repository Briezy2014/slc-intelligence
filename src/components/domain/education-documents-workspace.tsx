"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TableShell } from "@/components/data-display/table-shell";
import {
  recordEducationDocumentUploadAction,
  saveEducationDocumentAction,
} from "@/lib/actions/education-documents";
import { AiAssistPanel } from "@/components/domain/ai-assist-panel";
import {
  EDUCATION_DOCUMENT_DISCLAIMER,
  buildPrefillFields,
  getEducationDocumentTemplate,
} from "@/lib/catalogs/education-document-templates";
import type { EducationDocumentsData } from "@/lib/data/education-documents";
import type { EducationDocumentType } from "@/lib/supabase/types";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

function studentLabel(student: EducationDocumentsData["students"][number]) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}`;
}

const TABS: Array<{ id: EducationDocumentType; label: string }> = [
  { id: "iep", label: "IEP" },
  { id: "etr", label: "ETR" },
  { id: "progress_report", label: "Progress reports" },
];

export function EducationDocumentsWorkspace({
  data,
  initialTab = "iep",
  lockedStudentId,
}: {
  data: EducationDocumentsData;
  initialTab?: EducationDocumentType;
  lockedStudentId?: string;
}) {
  const [tab, setTab] = useState<EducationDocumentType>(initialTab);
  const [studentId, setStudentId] = useState(lockedStudentId ?? "");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const template = useMemo(() => getEducationDocumentTemplate(tab), [tab]);
  const selectedStudent = data.students.find((student) => student.id === studentId);
  const documents = data.documents.filter(
    (document) =>
      document.document_type === tab &&
      (!lockedStudentId || document.student_id === lockedStudentId),
  );
  const uploads = data.uploads.filter(
    (upload) =>
      (upload.document_type === tab || upload.document_type === "other") &&
      (!lockedStudentId || upload.student_id === lockedStudentId),
  );

  function prefillBlank() {
    if (!selectedStudent) {
      setMessage("Choose a student first.");
      return;
    }
    setFields(
      buildPrefillFields({
        template,
        studentName: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
        gradeLevel: selectedStudent.grade_level,
        localId: selectedStudent.local_identifier,
      }),
    );
    setMessage(
      "Blank template fields pre-populated from the student profile. Review every section before final use.",
    );
  }

  return (
    <div className="space-y-6">
      <Alert title="Educator / team review required" tone="warning">
        {EDUCATION_DOCUMENT_DISCLAIMER}
      </Alert>

      <div className="flex flex-wrap gap-2">
        {TABS.map((entry) => (
          <Button
            key={entry.id}
            type="button"
            variant={tab === entry.id ? "primary" : "secondary"}
            onClick={() => {
              setTab(entry.id);
              setFields({});
              setMessage(null);
            }}
          >
            {entry.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardTitle>{template.title}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
        {!data.permissions.canManage ? (
          <div className="mt-4">
            <Alert title="Permission needed" tone="warning">
              Your role can view this area but cannot create/edit document drafts.
            </Alert>
          </div>
        ) : (
          <form
            className="mt-4 space-y-4"
            action={(formData) => {
              startTransition(async () => {
                const result = await saveEducationDocumentAction(formData);
                setMessage(result.message ?? null);
              });
            }}
          >
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="documentType" value={tab} />
            <input type="hidden" name="templateKey" value={template.key} />
            <input type="hidden" name="fieldsJson" value={JSON.stringify(fields)} />
            <input type="hidden" name="status" value="draft" />

            {!lockedStudentId ? (
              <FormField id="documentStudentId" label="Student">
                <Select
                  id="documentStudentId"
                  name="studentId"
                  required
                  value={studentId}
                  onChange={(event) => setStudentId(event.target.value)}
                >
                  <option value="">Choose student</option>
                  {data.students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {studentLabel(student)}
                    </option>
                  ))}
                </Select>
              </FormField>
            ) : (
              <input type="hidden" name="studentId" value={lockedStudentId} />
            )}

            <FormField id="documentTitle" label="Document title">
              <Input
                id="documentTitle"
                name="title"
                required
                defaultValue={`${template.title}${selectedStudent ? ` · ${studentLabel(selectedStudent)}` : ""}`}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="schoolYear" label="School year">
                <Input id="schoolYear" name="schoolYear" placeholder="2026-2027" />
              </FormField>
              <FormField id="gradeLevel" label="Grade level">
                <Input
                  id="gradeLevel"
                  name="gradeLevel"
                  defaultValue={selectedStudent?.grade_level ?? ""}
                />
              </FormField>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={prefillBlank}
              disabled={!studentId && !lockedStudentId}
            >
              Start blank {tab.toUpperCase()} with pre-populated fields
            </Button>

            {template.sections.map((section) => (
              <div
                key={section.id}
                className="border-border space-y-3 rounded-[var(--radius-md)] border p-4"
              >
                <h3 className="font-semibold">{section.title}</h3>
                {section.fields.map((field) => (
                  <FormField key={field.key} id={`${tab}-${field.key}`} label={field.label}>
                    {field.kind === "textarea" ? (
                      <Textarea
                        id={`${tab}-${field.key}`}
                        value={fields[field.key] ?? ""}
                        onChange={(event) =>
                          setFields((current) => ({ ...current, [field.key]: event.target.value }))
                        }
                      />
                    ) : field.kind === "select" ? (
                      <Select
                        id={`${tab}-${field.key}`}
                        value={fields[field.key] ?? ""}
                        onChange={(event) =>
                          setFields((current) => ({ ...current, [field.key]: event.target.value }))
                        }
                      >
                        <option value="">Choose</option>
                        {(field.options ?? []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        id={`${tab}-${field.key}`}
                        type={field.kind === "date" ? "date" : "text"}
                        value={fields[field.key] ?? ""}
                        onChange={(event) =>
                          setFields((current) => ({ ...current, [field.key]: event.target.value }))
                        }
                      />
                    )}
                  </FormField>
                ))}
              </div>
            ))}

            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save draft for team review"}
            </Button>
          </form>
        )}
      </Card>

      <Card>
        <CardTitle>AI scan · populate fields from IEP/ETR text</CardTitle>
        <CardDescription>
          Paste text from an existing IEP/ETR (or OCR export). Local + optional model assist maps
          content into the draft fields below. Always review — this does not finalize legal
          documents. PDF binary auto-OCR storage can be connected next.
        </CardDescription>
        {data.permissions.canManage ? (
          <div className="mt-4">
            <AiAssistPanel
              domain="education_document"
              title="Scan document text into fields"
              description="Paste source text in Extra notes. Focus area can be iep, etr, or progress_report."
              defaultFocusArea={tab}
              onApply={(suggestion) => {
                if (suggestion.fields && Object.keys(suggestion.fields).length > 0) {
                  setFields((current) => ({ ...current, ...suggestion.fields }));
                  setMessage(
                    "AI mapped fields into the draft. Review every section before saving or team use.",
                  );
                } else {
                  setMessage(suggestion.draftText || "No fields were mapped from that text.");
                }
              }}
            />
          </div>
        ) : null}
      </Card>

      <Card>
        <CardTitle>Upload existing {tab.toUpperCase()} / related file</CardTitle>
        <CardDescription>
          Records file metadata now. For field population, paste document text into AI scan above
          (full PDF OCR storage can be connected next).
        </CardDescription>
        {data.permissions.canManage ? (
          <form
            action={submitAction(recordEducationDocumentUploadAction)}
            className="mt-4 space-y-3"
          >
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="documentType" value={tab} />
            {lockedStudentId ? (
              <input type="hidden" name="studentId" value={lockedStudentId} />
            ) : (
              <FormField id="uploadStudentId" label="Student">
                <Select id="uploadStudentId" name="studentId" required defaultValue={studentId}>
                  <option value="">Choose student</option>
                  {data.students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {studentLabel(student)}
                    </option>
                  ))}
                </Select>
              </FormField>
            )}
            <FormField id="fileName" label="File name">
              <Input
                id="fileName"
                name="fileName"
                required
                placeholder="StudentLast_IEP_2026.pdf"
                onChange={(event) => {
                  const fileInput = document.getElementById(
                    "sourceFile",
                  ) as HTMLInputElement | null;
                  if (fileInput?.files?.[0] && !event.target.value) {
                    event.target.value = fileInput.files[0].name;
                  }
                }}
              />
            </FormField>
            <FormField id="sourceFile" label="Choose file (local reference)">
              <Input
                id="sourceFile"
                type="file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const nameInput = document.getElementById("fileName") as HTMLInputElement | null;
                  const typeInput = document.getElementById(
                    "contentType",
                  ) as HTMLInputElement | null;
                  const sizeInput = document.getElementById("byteSize") as HTMLInputElement | null;
                  if (nameInput) nameInput.value = file.name;
                  if (typeInput) typeInput.value = file.type;
                  if (sizeInput) sizeInput.value = String(file.size);
                }}
              />
            </FormField>
            <input type="hidden" id="contentType" name="contentType" />
            <input type="hidden" id="byteSize" name="byteSize" />
            <FormField id="uploadNotes" label="Notes">
              <Textarea
                id="uploadNotes"
                name="notes"
                placeholder="Source, meeting date, version notes"
              />
            </FormField>
            <Button type="submit">Record upload</Button>
          </form>
        ) : null}
      </Card>

      {message ? (
        <Alert title="Document workspace" tone="info">
          {message}
        </Alert>
      ) : null}

      <TableShell
        caption={`${tab.toUpperCase()} drafts`}
        headers={["Title", "Student", "Status", "Updated"]}
        rows={documents.map((document) => {
          const student = data.students.find((entry) => entry.id === document.student_id);
          return [
            document.title,
            student ? studentLabel(student) : document.student_id,
            document.status,
            new Date(document.updated_at).toLocaleString(),
          ];
        })}
      />
      <TableShell
        caption="Upload records"
        headers={["File", "Student", "Type", "Notes"]}
        rows={uploads.map((upload) => {
          const student = data.students.find((entry) => entry.id === upload.student_id);
          return [
            upload.file_name,
            student ? studentLabel(student) : upload.student_id,
            upload.document_type,
            upload.notes ?? "",
          ];
        })}
      />

      <p className="text-muted text-sm">
        Related module:{" "}
        <Link href="/reports" className="text-accent font-semibold hover:underline">
          Progress reporting
        </Link>
        .
      </p>
    </div>
  );
}
