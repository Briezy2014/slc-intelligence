"use client";

import { useMemo, useState, useTransition } from "react";
import { FormField } from "@/components/forms/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveStudentAccommodationsBatchAction } from "@/lib/actions/accommodations";
import type { AccommodationLibraryItem, Student } from "@/lib/supabase/types";

function studentName(student: Student) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}${
    student.local_identifier ? ` (${student.local_identifier})` : ""
  }`;
}

type AccommodationRow = {
  key: string;
  libraryItemId: string;
  title: string;
  description: string;
  accommodationArea: string;
};

function newRow(): AccommodationRow {
  return {
    key: crypto.randomUUID(),
    libraryItemId: "",
    title: "",
    description: "",
    accommodationArea: "",
  };
}

export function AssignStudentAccommodationsForm({
  organizationId,
  students,
  libraryItems,
  defaultStudentId = "",
}: {
  organizationId: string;
  students: Student[];
  libraryItems: AccommodationLibraryItem[];
  defaultStudentId?: string;
}) {
  const [studentId, setStudentId] = useState(defaultStudentId);
  const [rows, setRows] = useState<AccommodationRow[]>([newRow()]);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [pending, startTransition] = useTransition();

  const libraryById = useMemo(() => {
    const map = new Map<string, AccommodationLibraryItem>();
    for (const item of libraryItems) map.set(item.id, item);
    return map;
  }, [libraryItems]);

  function updateRow(key: string, patch: Partial<AccommodationRow>) {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function selectLibraryItem(key: string, libraryItemId: string) {
    if (!libraryItemId) {
      updateRow(key, {
        libraryItemId: "",
        title: "",
        description: "",
        accommodationArea: "",
      });
      return;
    }
    const item = libraryById.get(libraryItemId);
    if (!item) {
      updateRow(key, { libraryItemId });
      return;
    }
    updateRow(key, {
      libraryItemId,
      title: item.name,
      description: item.description,
      accommodationArea: item.accommodation_area ?? "",
    });
  }

  function removeRow(key: string) {
    setRows((current) =>
      current.length <= 1 ? current : current.filter((row) => row.key !== key),
    );
  }

  return (
    <Card>
      <CardTitle>Assign supports to a student</CardTitle>
      <CardDescription>
        Choose the student, pick supports from the dropdown ({libraryItems.length} ready). Title and
        description fill in automatically — edit if you want, then save one or many at once.
      </CardDescription>

      {students.length === 0 ? (
        <div className="mt-4">
          <Alert title="Add a student first" tone="warning">
            Create a student under Students, then come back to assign supports.
          </Alert>
        </div>
      ) : (
        <form
          className="mt-4 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(null);
            startTransition(async () => {
              const formData = new FormData();
              formData.set("organizationId", organizationId);
              formData.set("studentId", studentId);
              formData.set(
                "itemsJson",
                JSON.stringify(
                  rows.map((row) => ({
                    libraryItemId: row.libraryItemId || undefined,
                    title: row.title,
                    description: row.description,
                    accommodationArea: row.accommodationArea || undefined,
                    status: "draft",
                  })),
                ),
              );
              const result = await saveStudentAccommodationsBatchAction(formData);
              setStatus(result.status === "success" ? "success" : "error");
              setMessage(result.message ?? null);
              if (result.status === "success") {
                setRows([newRow()]);
              }
            });
          }}
        >
          <FormField id="assignStudentId" label="1. Which student?">
            <Select
              id="assignStudentId"
              value={studentId}
              required
              onChange={(event) => setStudentId(event.target.value)}
              disabled={Boolean(defaultStudentId) && students.length === 1}
            >
              <option value="">Choose student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {studentName(student)}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="space-y-4">
            {rows.map((row, index) => (
              <div
                key={row.key}
                className="border-border bg-surface-subtle/40 space-y-3 rounded-[var(--radius-lg)] border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Support {index + 1}</p>
                  {rows.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(row.key)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
                <FormField
                  id={`library-${row.key}`}
                  label="2. Which support from the library?"
                  description="The list opens in this dropdown — no separate library panel needed."
                >
                  <Select
                    id={`library-${row.key}`}
                    value={row.libraryItemId}
                    onChange={(event) => selectLibraryItem(row.key, event.target.value)}
                  >
                    <option value="">Custom (type title & description)</option>
                    {libraryItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.accommodation_area
                          ? `${item.name} · ${item.accommodation_area}`
                          : item.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField id={`title-${row.key}`} label="Title (auto-filled, editable)">
                  <Input
                    id={`title-${row.key}`}
                    required
                    value={row.title}
                    onChange={(event) => updateRow(row.key, { title: event.target.value })}
                    placeholder="Fills when you pick a library support"
                  />
                </FormField>
                <FormField
                  id={`description-${row.key}`}
                  label="Description (auto-filled, editable)"
                >
                  <Textarea
                    id={`description-${row.key}`}
                    required
                    value={row.description}
                    onChange={(event) => updateRow(row.key, { description: event.target.value })}
                    placeholder="What this support looks like for this student"
                  />
                </FormField>
                {row.accommodationArea ? (
                  <p className="text-muted text-xs">Area: {row.accommodationArea}</p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRows((current) => [...current, newRow()])}
            >
              Add another accommodation
            </Button>
            <Button type="submit" disabled={pending || !studentId}>
              {pending
                ? "Saving…"
                : rows.length > 1
                  ? `Save ${rows.length} accommodations`
                  : "Save accommodation"}
            </Button>
          </div>

          {message ? (
            <Alert
              title={status === "success" ? "Saved" : "Could not save"}
              tone={status === "success" ? "success" : "danger"}
            >
              {message}
            </Alert>
          ) : null}
        </form>
      )}
    </Card>
  );
}
