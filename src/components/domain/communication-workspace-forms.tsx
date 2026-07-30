"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { saveCommunicationLogAction, saveContactAction } from "@/lib/actions/communications";
import {
  COMMUNICATION_TEMPLATES,
  applyCommunicationTemplate,
  getCommunicationTemplate,
} from "@/lib/catalogs";
import { AiAssistPanel } from "@/components/domain/ai-assist-panel";
import type { Student, StudentContact } from "@/lib/supabase/types";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

function studentName(student: Student) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}`;
}

export function ContactAndCommunicationForms({
  organizationId,
  students,
  contacts,
  canManageContacts,
  canEnterCommunication,
  studentId,
}: {
  organizationId: string;
  students: Student[];
  contacts: StudentContact[];
  canManageContacts: boolean;
  canEnterCommunication: boolean;
  studentId?: string;
}) {
  const visibleStudents = studentId ? students.filter((student) => student.id === studentId) : students;
  const [contactStudentId, setContactStudentId] = useState(studentId ?? "");
  const [logStudentId, setLogStudentId] = useState(studentId ?? "");
  const [contactId, setContactId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [visibility, setVisibility] = useState("family_visible");

  const contactsForStudent = useMemo(
    () => (logStudentId ? contacts.filter((contact) => contact.student_id === logStudentId) : contacts),
    [contacts, logStudentId],
  );

  const selectedStudent = visibleStudents.find((student) => student.id === logStudentId);
  const selectedContact = contactsForStudent.find((contact) => contact.id === contactId);

  function insertDraft() {
    const template = getCommunicationTemplate(templateId);
    if (!template) return;
    const draft = applyCommunicationTemplate(template, {
      studentFirstName: selectedStudent?.preferred_name || selectedStudent?.first_name,
      contactFirstName: selectedContact?.first_name,
      focusArea: focusArea || undefined,
      staffName: "SLC Intelligence team",
    });
    setSubject(draft.subject);
    setSummary(draft.summary);
    setVisibility(draft.visibility);
  }

  return (
    <div className="space-y-6">
      {students.length === 0 ? (
        <Alert title="Create a student first" tone="warning">
          Contacts and communications attach to students. Start at{" "}
          <Link href="/students/new" className="font-semibold underline">
            Students → New student
          </Link>
          .
        </Alert>
      ) : null}
      <AiAssistPanel
        domain="communication"
        title="AI Assist · Family communication"
        description="Generate reviewable parent/guardian communication drafts from your focus area."
        onApply={(suggestion) => {
          setSubject(suggestion.fields?.subject ?? suggestion.title);
          setSummary(suggestion.fields?.summary ?? suggestion.draftText);
          if (suggestion.fields?.visibility) setVisibility(suggestion.fields.visibility);
          if (suggestion.fields?.focusArea) setFocusArea(suggestion.fields.focusArea);
        }}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border-border bg-background-elevated rounded-[var(--radius-lg)] border p-4">
          <h3 className="text-lg font-semibold">Contact</h3>
          {canManageContacts ? (
            <form action={submitAction(saveContactAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={organizationId} />
              <FormField id="contactStudentId" label="Student">
                <Select
                  id="contactStudentId"
                  name="studentId"
                  required
                  value={contactStudentId}
                  onChange={(event) => setContactStudentId(event.target.value)}
                >
                  <option value="">Choose student</option>
                  {visibleStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {studentName(student)}
                    </option>
                  ))}
                </Select>
              </FormField>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField id="firstName" label="First name">
                  <Input id="firstName" name="firstName" required />
                </FormField>
                <FormField id="lastName" label="Last name">
                  <Input id="lastName" name="lastName" required />
                </FormField>
              </div>
              <FormField id="relationship" label="Relationship">
                <Input id="relationship" name="relationship" required placeholder="Parent / guardian" />
              </FormField>
              <Button type="submit" disabled={students.length === 0}>
                Save contact
              </Button>
            </form>
          ) : (
            <Alert title="Permission needed" tone="warning">
              Contact management requires an authorized role.
            </Alert>
          )}
        </div>

        <div className="border-border bg-background-elevated rounded-[var(--radius-lg)] border p-4">
          <h3 className="text-lg font-semibold">Communication log</h3>
          {canEnterCommunication ? (
            <form action={submitAction(saveCommunicationLogAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={organizationId} />
              <FormField id="communicationStudentId" label="Student">
                <Select
                  id="communicationStudentId"
                  name="studentId"
                  required
                  value={logStudentId}
                  onChange={(event) => {
                    setLogStudentId(event.target.value);
                    setContactId("");
                  }}
                >
                  <option value="">Choose student</option>
                  {visibleStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {studentName(student)}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="contactId" label="Contact">
                <Select
                  id="contactId"
                  name="contactId"
                  value={contactId}
                  onChange={(event) => setContactId(event.target.value)}
                >
                  <option value="">No contact selected</option>
                  {contactsForStudent.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.last_name}, {contact.first_name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="draftTemplateId" label="Draft from starter template">
                <Select
                  id="draftTemplateId"
                  value={templateId}
                  onChange={(event) => setTemplateId(event.target.value)}
                >
                  <option value="">Choose a communication template</option>
                  {COMMUNICATION_TEMPLATES.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="focusArea" label="Focus area for draft">
                <Input
                  id="focusArea"
                  value={focusArea}
                  onChange={(event) => setFocusArea(event.target.value)}
                  placeholder="reading fluency, calm-down routine, etc."
                />
              </FormField>
              <Button type="button" variant="secondary" onClick={insertDraft} disabled={!templateId}>
                Insert draft language
              </Button>
              <p className="text-muted text-sm">
                Drafts are starter language for educator review — not automatic AI conclusions.
              </p>
              <FormField id="visibility" label="Visibility">
                <Select
                  id="visibility"
                  name="visibility"
                  value={visibility}
                  onChange={(event) => setVisibility(event.target.value)}
                >
                  <option value="family_visible">Family visible</option>
                  <option value="internal">Internal</option>
                  <option value="restricted_admin">Restricted admin</option>
                </Select>
              </FormField>
              <input type="hidden" name="method" value="phone" />
              <input type="hidden" name="direction" value="outbound" />
              <input type="hidden" name="status" value="draft" />
              <FormField id="subject" label="Subject">
                <Input
                  id="subject"
                  name="subject"
                  required
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                />
              </FormField>
              <FormField id="summary" label="Summary">
                <Textarea
                  id="summary"
                  name="summary"
                  required
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                />
              </FormField>
              <Button type="submit" disabled={students.length === 0}>
                Save communication
              </Button>
            </form>
          ) : (
            <Alert title="Permission needed" tone="warning">
              Communication entry requires an authorized role.
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
