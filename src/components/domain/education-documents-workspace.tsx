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
import { AiAssistPanel } from "@/components/domain/ai-assist-panel";
import {
  recordDistrictFormTemplateAction,
  recordEducationDocumentUploadAction,
  saveEducationDocumentAction,
} from "@/lib/actions/education-documents";
import { generateAiAssistSuggestionsAction } from "@/lib/actions/ai-assist";
import {
  EDUCATION_DOCUMENT_DISCLAIMER,
  OHIO_DOCUMENT_DISCLAIMER,
  buildPrefillFields,
  getEducationDocumentTemplate,
  listEducationDocumentTemplates,
  type EducationTemplatePack,
} from "@/lib/catalogs/education-document-templates";
import { extractDocumentText } from "@/lib/documents/extract-document-text";
import { mapDocumentTextToFields } from "@/lib/documents/map-document-text";
import type { EducationDocumentsData } from "@/lib/data/education-documents";
import type { EducationDocumentType } from "@/lib/supabase/types";

function studentLabel(student: EducationDocumentsData["students"][number]) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}`;
}

const TABS: Array<{ id: EducationDocumentType; label: string }> = [
  { id: "iep", label: "IEP" },
  { id: "etr", label: "ETR" },
  { id: "progress_report", label: "Progress reports" },
  { id: "section_504", label: "504" },
  { id: "gifted", label: "Gifted" },
  { id: "el", label: "EL" },
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
  const [templatePack, setTemplatePack] = useState<EducationTemplatePack>("ohio_aligned");
  const [studentId, setStudentId] = useState(lockedStudentId ?? "");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState("");
  const [blankTemplateFile, setBlankTemplateFile] = useState<File | null>(null);
  const [blankTemplateName, setBlankTemplateName] = useState("");
  const [scanPending, setScanPending] = useState(false);
  const [pending, startTransition] = useTransition();

  const template = useMemo(
    () => getEducationDocumentTemplate(tab, templatePack),
    [tab, templatePack],
  );
  const packOptions = useMemo(() => listEducationDocumentTemplates(tab), [tab]);
  const selectedStudent = data.students.find((student) => student.id === studentId);
  const effectiveStudentId = lockedStudentId || studentId;
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

  async function uploadAndPopulate() {
    if (!data.organizationId) {
      setMessage("Organization context is missing.");
      return;
    }
    if (!effectiveStudentId) {
      setMessage("Choose a student before uploading.");
      return;
    }
    if (!uploadFile) {
      setMessage("Choose a PDF, image, or text file to upload.");
      return;
    }

    setScanPending(true);
    setMessage("Reading document and extracting text…");

    try {
      const extraction = await extractDocumentText(uploadFile);
      if (!extraction.text || extraction.text.length < 20) {
        setMessage(
          extraction.warning ||
            "Could not extract enough text from that file. Try a clearer PDF/scan.",
        );
        setScanPending(false);
        return;
      }

      setMessage(
        `Extracted text via ${extraction.method.replaceAll("_", " ")} (${extraction.pageCount} page${extraction.pageCount === 1 ? "" : "s"}). Mapping fields…`,
      );

      const localFields = mapDocumentTextToFields(tab, extraction.text);
      const aiResult = await generateAiAssistSuggestionsAction({
        domain: "education_document",
        focusArea: tab,
        studentContext: selectedStudent
          ? `${selectedStudent.first_name} ${selectedStudent.last_name}, grade ${selectedStudent.grade_level ?? "n/a"}`
          : "",
        extraNotes: extraction.text.slice(0, 20000),
      });
      const aiFields = aiResult.suggestions[0]?.fields ?? {};
      const mergedFields = {
        ...buildPrefillFields({
          template,
          studentName: selectedStudent
            ? `${selectedStudent.first_name} ${selectedStudent.last_name}`
            : "",
          gradeLevel: selectedStudent?.grade_level,
          localId: selectedStudent?.local_identifier,
        }),
        ...localFields,
        ...aiFields,
      };
      setFields(mergedFields);

      const formData = new FormData();
      formData.set("organizationId", data.organizationId);
      formData.set("studentId", effectiveStudentId);
      formData.set("documentType", tab);
      formData.set("fileName", uploadFile.name);
      formData.set("contentType", uploadFile.type || "application/octet-stream");
      formData.set("byteSize", String(uploadFile.size));
      formData.set("extractionMethod", extraction.method);
      formData.set("extractedTextPreview", extraction.text.slice(0, 1500));
      formData.set(
        "notes",
        [uploadNotes.trim(), `Auto-extracted via ${extraction.method}.`, extraction.warning ?? ""]
          .filter(Boolean)
          .join(" "),
      );
      formData.set("file", uploadFile);

      const uploadResult = await recordEducationDocumentUploadAction(formData);

      const draftData = new FormData();
      draftData.set("organizationId", data.organizationId);
      draftData.set("studentId", effectiveStudentId);
      draftData.set("documentType", tab);
      draftData.set("templateKey", template.key);
      draftData.set("status", "draft");
      draftData.set(
        "title",
        `${template.title} · ${selectedStudent ? studentLabel(selectedStudent) : "student"} · from upload`,
      );
      draftData.set("gradeLevel", selectedStudent?.grade_level ?? "");
      draftData.set("fieldsJson", JSON.stringify(mergedFields));
      const draftResult = await saveEducationDocumentAction(draftData);

      const fieldCount = Object.keys(mergedFields).length;
      setMessage(
        [
          uploadResult.message,
          draftResult.message,
          `Populated ${fieldCount} draft field${fieldCount === 1 ? "" : "s"} from the uploaded file.`,
          extraction.warning,
          "Review every section before team use — this is assistive drafting only.",
        ]
          .filter(Boolean)
          .join(" "),
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Upload/OCR failed: ${error.message}`
          : "Upload/OCR failed. Try another file or paste text in AI scan.",
      );
    } finally {
      setScanPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <Alert title="Educator / team review required" tone="warning">
        {templatePack === "ohio_aligned" ? OHIO_DOCUMENT_DISCLAIMER : EDUCATION_DOCUMENT_DISCLAIMER}
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

      <FormField id="templatePack" label="Blank template pack">
        <Select
          id="templatePack"
          value={templatePack}
          onChange={(event) => {
            setTemplatePack(event.target.value as EducationTemplatePack);
            setFields({});
            setMessage(null);
          }}
        >
          <option value="ohio_aligned">Ohio-aligned official-style blank (recommended)</option>
          <option value="generic">Generic structured blank</option>
        </Select>
      </FormField>
      <p className="text-muted text-sm">
        Active draft: {template.title}. Available packs:{" "}
        {packOptions.map((entry) => entry.title).join(" · ")}. These are structured drafting aids,
        not ODE fillable legal PDFs.
      </p>

      <Card>
        <CardTitle>District blank {tab.replaceAll("_", " ").toUpperCase()} template</CardTitle>
        <CardDescription>
          Upload your official district blank IEP/ETR/504/Gifted/EL form as a master template. SLC
          stores the blank for reference and extracts text so staff can fill structured drafts for a
          student. This does not replace the district&apos;s controlling legal form.
        </CardDescription>
        {!data.permissions.canManage ? (
          <div className="mt-4">
            <Alert title="Permission needed" tone="warning">
              Your role can view this area but cannot upload district blank templates.
            </Alert>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <FormField id="blankTemplateName" label="Template name">
              <Input
                id="blankTemplateName"
                value={blankTemplateName}
                onChange={(event) => setBlankTemplateName(event.target.value)}
                placeholder={`District blank ${tab.replaceAll("_", " ")} form`}
              />
            </FormField>
            <FormField id="blankTemplateFile" label="Blank official form (PDF/image/text)">
              <Input
                id="blankTemplateFile"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,application/pdf,image/*,text/plain"
                onChange={(event) => setBlankTemplateFile(event.target.files?.[0] ?? null)}
              />
            </FormField>
            <Button
              type="button"
              variant="secondary"
              disabled={scanPending || !blankTemplateFile}
              onClick={() => {
                void (async () => {
                  if (!data.organizationId || !blankTemplateFile) return;
                  setScanPending(true);
                  setMessage("Reading blank district form…");
                  try {
                    const extraction = await extractDocumentText(blankTemplateFile);
                    const formData = new FormData();
                    formData.set("organizationId", data.organizationId);
                    formData.set("documentType", tab);
                    formData.set(
                      "name",
                      blankTemplateName.trim() ||
                        `District blank ${tab.replaceAll("_", " ")} · ${blankTemplateFile.name}`,
                    );
                    formData.set("fileName", blankTemplateFile.name);
                    formData.set("contentType", blankTemplateFile.type || "application/octet-stream");
                    formData.set("byteSize", String(blankTemplateFile.size));
                    formData.set("extractedText", extraction.text.slice(0, 50000));
                    formData.set("file", blankTemplateFile);
                    const result = await recordDistrictFormTemplateAction(formData);
                    setMessage(
                      [
                        result.message,
                        extraction.warning,
                        "Next: choose a student and start a blank draft or upload a completed form to auto-fill.",
                      ]
                        .filter(Boolean)
                        .join(" "),
                    );
                    setBlankTemplateFile(null);
                  } catch (error) {
                    setMessage(
                      error instanceof Error
                        ? `Blank template upload failed: ${error.message}`
                        : "Blank template upload failed.",
                    );
                  } finally {
                    setScanPending(false);
                  }
                })();
              }}
            >
              {scanPending ? "Saving blank template…" : "Save district blank template"}
            </Button>
            {(data.districtTemplates ?? []).filter((entry) => entry.document_type === tab).length >
            0 ? (
              <TableShell
                caption="Saved district blank templates"
                headers={["Name", "File", "Updated"]}
                rows={(data.districtTemplates ?? [])
                  .filter((entry) => entry.document_type === tab)
                  .map((entry) => [
                    entry.name,
                    entry.file_name ?? "—",
                    new Date(entry.updated_at).toLocaleString(),
                  ])}
              />
            ) : null}
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>Upload completed {tab.replaceAll("_", " ").toUpperCase()} · auto-fill fields</CardTitle>
        <CardDescription>
          Upload a completed PDF, scanned image, or text export. The app extracts text (PDF text
          layer or OCR) and populates the draft fields automatically for your review.
        </CardDescription>
        {!data.permissions.canManage ? (
          <div className="mt-4">
            <Alert title="Permission needed" tone="warning">
              Your role can view this area but cannot upload or edit document drafts.
            </Alert>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {!lockedStudentId ? (
              <FormField id="uploadStudentId" label="Student">
                <Select
                  id="uploadStudentId"
                  value={studentId}
                  onChange={(event) => setStudentId(event.target.value)}
                  required
                >
                  <option value="">Choose student</option>
                  {data.students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {studentLabel(student)}
                    </option>
                  ))}
                </Select>
              </FormField>
            ) : null}
            <FormField id="sourceFile" label="Choose PDF, image, or text file">
              <Input
                id="sourceFile"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,application/pdf,image/*,text/plain"
                onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
              />
            </FormField>
            <FormField id="uploadNotes" label="Notes (optional)">
              <Textarea
                id="uploadNotes"
                value={uploadNotes}
                onChange={(event) => setUploadNotes(event.target.value)}
                placeholder="Source, meeting date, version notes"
              />
            </FormField>
            <Button
              type="button"
              disabled={scanPending || !uploadFile || !effectiveStudentId}
              onClick={() => {
                void uploadAndPopulate();
              }}
            >
              {scanPending ? "Scanning & filling fields…" : "Upload & populate fields"}
            </Button>
            <p className="text-muted text-xs">
              Text PDFs extract instantly. Scanned PDFs/images use OCR (first 8 pages). Optional
              Supabase Storage bucket keeps the binary when configured.
            </p>
          </div>
        )}
      </Card>

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

            <Button type="submit" disabled={pending || scanPending}>
              {pending ? "Saving…" : "Save draft for team review"}
            </Button>
          </form>
        )}
      </Card>

      <Card>
        <CardTitle>Optional · paste text if OCR misses something</CardTitle>
        <CardDescription>
          Use this only if a section did not extract cleanly from the uploaded file.
        </CardDescription>
        {data.permissions.canManage ? (
          <div className="mt-4">
            <AiAssistPanel
              domain="education_document"
              title="Paste leftover text into fields"
              description="Paste additional source text in Extra notes. Focus area can be iep, etr, or progress_report."
              defaultFocusArea={tab}
              onApply={(suggestion) => {
                if (suggestion.fields && Object.keys(suggestion.fields).length > 0) {
                  setFields((current) => ({ ...current, ...suggestion.fields }));
                  setMessage(
                    "AI mapped additional fields into the draft. Review every section before saving.",
                  );
                } else {
                  setMessage(suggestion.draftText || "No fields were mapped from that text.");
                }
              }}
            />
          </div>
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
      </p>
    </div>
  );
}
