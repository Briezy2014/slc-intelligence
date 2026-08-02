"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import {
  saveCommunicationLogAction,
  saveContactAction,
  translateCommunicationDraftAction,
} from "@/lib/actions/communications";
import {
  COMMUNICATION_TEMPLATES,
  applyCommunicationTemplate,
  getCommunicationTemplate,
} from "@/lib/catalogs";
import { enrichCommunicationDraftContext } from "@/lib/catalogs/behavior-communication";
import { getBehaviorDefinitionTemplate } from "@/lib/catalogs/behavior-templates";
import {
  COMMUNICATION_LANGUAGES,
  communicationLanguageLabel,
} from "@/lib/catalogs/communication-languages";
import { AiAssistPanel } from "@/components/domain/ai-assist-panel";
import { SpecificBehaviorSelect } from "@/components/domain/specific-behavior-select";
import type { Student, StudentContact } from "@/lib/supabase/types";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

function studentName(student: Student) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}`;
}

type ComposeTab = "compose" | "template_language";

export type FamilyCommunicationView = "dashboard" | "contacts" | "communications";

export function ContactAndCommunicationForms({
  organizationId,
  students,
  contacts,
  canManageContacts,
  canEnterCommunication,
  studentId,
  view = "dashboard",
}: {
  organizationId: string;
  students: Student[];
  contacts: StudentContact[];
  canManageContacts: boolean;
  canEnterCommunication: boolean;
  studentId?: string;
  view?: FamilyCommunicationView;
}) {
  const visibleStudents = studentId
    ? students.filter((student) => student.id === studentId)
    : students;
  const [contactStudentId, setContactStudentId] = useState(studentId ?? "");
  const [logStudentId, setLogStudentId] = useState(studentId ?? "");
  const [contactId, setContactId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [behaviorTemplateId, setBehaviorTemplateId] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [sourceSummary, setSourceSummary] = useState("");
  const [visibility, setVisibility] = useState("family_visible");
  const [languageCode, setLanguageCode] = useState("en");
  const [method, setMethod] = useState("email");
  const [acknowledgementRequested, setAcknowledgementRequested] = useState(true);
  const [composeTab, setComposeTab] = useState<ComposeTab>("template_language");
  const [translateMessage, setTranslateMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const contactsForStudent = useMemo(
    () =>
      logStudentId ? contacts.filter((contact) => contact.student_id === logStudentId) : contacts,
    [contacts, logStudentId],
  );

  const selectedStudent = visibleStudents.find((student) => student.id === logStudentId);
  const selectedContact = contactsForStudent.find((contact) => contact.id === contactId);

  function selectBehavior(id: string) {
    setBehaviorTemplateId(id);
    const behavior = getBehaviorDefinitionTemplate(id);
    if (behavior) setFocusArea(behavior.name);
  }

  function insertDraft() {
    const template = getCommunicationTemplate(templateId);
    if (!template) return;
    const isBehaviorLetter =
      template.id.startsWith("behavior") ||
      template.id === "bus-behavior" ||
      template.id === "bullying-followup" ||
      template.id === "discipline-conference" ||
      template.id === "internal-behavior-debrief";
    if (isBehaviorLetter && !behaviorTemplateId && !focusArea.trim()) {
      setTranslateMessage("Select a specific behavior before inserting this letter draft.");
      return;
    }
    const draftContext = enrichCommunicationDraftContext(
      {
        studentFirstName: selectedStudent?.preferred_name || selectedStudent?.first_name,
        contactFirstName: selectedContact?.first_name,
        focusArea: focusArea || undefined,
        staffName: "SLC Intelligence team",
      },
      behaviorTemplateId || undefined,
    );
    const draft = applyCommunicationTemplate(template, draftContext);
    setSubject(draft.subject);
    setSummary(draft.summary);
    setSourceSummary(draft.summary);
    setVisibility(draft.visibility);
    setMethod(draft.method);
    if (draft.visibility === "family_visible") setAcknowledgementRequested(true);
    setTranslateMessage(
      languageCode === "en"
        ? "English template inserted. Review before saving."
        : `English template inserted. Open Template & language and translate to ${communicationLanguageLabel(languageCode)}.`,
    );
    setComposeTab("compose");
  }

  function runTranslate() {
    if (!subject.trim() || !summary.trim()) {
      setTranslateMessage("Add subject and summary (or insert a template) before translating.");
      return;
    }
    startTransition(async () => {
      const result = await translateCommunicationDraftAction({
        subject,
        summary: sourceSummary || summary,
        targetLanguageCode: languageCode,
      });
      if (result.ok) {
        if (!sourceSummary) setSourceSummary(summary);
        setSubject(result.subject);
        setSummary(result.summary);
      }
      setTranslateMessage(result.message);
      setComposeTab("compose");
    });
  }

  // Landing page is cards-only — forms open after a tap (same pattern as Classroom).
  const showContacts = view === "contacts";
  const showCommunications = view === "communications";

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
      {view === "dashboard" ? (
        <Alert title="Tap a card above to open a workspace" tone="info">
          <strong>Contacts</strong> adds who can receive notes. <strong>Write a message</strong>{" "}
          opens the student dropdown, behavior dropdown, templates, and AI Assist.{" "}
          <strong>Messages for families</strong> is the ready-to-send checklist.
        </Alert>
      ) : null}
      {showCommunications ? (
        <AiAssistPanel
          domain="communication"
          title="AI Assist · Family communication"
          description="1) Choose the student. 2) Choose the specific behavior. Generate a parent-friendly draft — then edit before saving."
          students={visibleStudents}
          studentId={studentId}
          onApply={(suggestion) => {
            setSubject(suggestion.fields?.subject ?? suggestion.title);
            setSummary(suggestion.fields?.summary ?? suggestion.draftText);
            setSourceSummary(suggestion.fields?.summary ?? suggestion.draftText);
            if (suggestion.fields?.visibility) setVisibility(suggestion.fields.visibility);
            if (suggestion.fields?.focusArea) setFocusArea(suggestion.fields.focusArea);
            if (suggestion.fields?.behaviorTemplateId) {
              setBehaviorTemplateId(suggestion.fields.behaviorTemplateId);
            }
            if (suggestion.fields?.method) setMethod(suggestion.fields.method);
            setComposeTab("compose");
          }}
        />
      ) : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {showContacts ? (
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
                  <Input
                    id="relationship"
                    name="relationship"
                    required
                    placeholder="Parent / guardian"
                  />
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
        ) : null}

        {showCommunications ? (
          <div className="border-border bg-background-elevated rounded-[var(--radius-lg)] border p-4">
            <h3 className="text-lg font-semibold">Communication</h3>
            {canEnterCommunication ? (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={composeTab === "template_language" ? "primary" : "secondary"}
                    onClick={() => setComposeTab("template_language")}
                  >
                    Template & language
                  </Button>
                  <Button
                    type="button"
                    variant={composeTab === "compose" ? "primary" : "secondary"}
                    onClick={() => setComposeTab("compose")}
                  >
                    Compose & save
                  </Button>
                </div>

                {composeTab === "template_language" ? (
                  <div className="space-y-3">
                    <Alert title="Choose template, behavior, and language" tone="info">
                      For behavior letters, pick a specific behavior from the dropdown (no typing
                      needed). Then choose a template and language, insert the English draft, and
                      translate before saving.
                    </Alert>
                    <FormField id="draftTemplateId" label="Communication template">
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
                    <SpecificBehaviorSelect
                      id="draftSpecificBehavior"
                      value={behaviorTemplateId}
                      onChange={selectBehavior}
                      helperText="Use this for behavior, safety, bus, boundary, and peer-conflict letters."
                    />
                    <FormField id="languageCodePicker" label="Language">
                      <Select
                        id="languageCodePicker"
                        value={languageCode}
                        onChange={(event) => setLanguageCode(event.target.value)}
                      >
                        {COMMUNICATION_LANGUAGES.map((language) => (
                          <option key={language.code} value={language.code}>
                            {language.name} ({language.nativeName})
                          </option>
                        ))}
                      </Select>
                    </FormField>
                    <FormField
                      id="focusArea"
                      label="Focus area for draft (auto-filled from behavior, or custom)"
                    >
                      <Input
                        id="focusArea"
                        value={focusArea}
                        onChange={(event) => {
                          setFocusArea(event.target.value);
                          setBehaviorTemplateId("");
                        }}
                        placeholder="Select a specific behavior above, or type reading fluency, etc."
                      />
                    </FormField>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={insertDraft}
                        disabled={!templateId}
                      >
                        Insert template draft
                      </Button>
                      <Button
                        type="button"
                        onClick={runTranslate}
                        disabled={pending || languageCode === "en"}
                      >
                        {pending ? "Translating…" : "Translate draft"}
                      </Button>
                    </div>
                    <p className="text-muted text-sm">
                      Translation uses AI Assist when configured. Always have a bilingual staff
                      member or interpreter review before family delivery.
                    </p>
                    {translateMessage ? (
                      <Alert title="Draft language status" tone="info">
                        {translateMessage}
                      </Alert>
                    ) : null}
                  </div>
                ) : (
                  <form action={submitAction(saveCommunicationLogAction)} className="space-y-3">
                    <input type="hidden" name="organizationId" value={organizationId} />
                    <input type="hidden" name="languageCode" value={languageCode} />
                    <input type="hidden" name="sourceLanguageCode" value="en" />
                    <input type="hidden" name="sourceSummary" value={sourceSummary} />
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
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField id="method" label="Method">
                        <Select
                          id="method"
                          name="method"
                          value={method}
                          onChange={(event) => setMethod(event.target.value)}
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="text">Text</option>
                          <option value="letter">Letter</option>
                          <option value="in_person">In person</option>
                          <option value="portal">Portal</option>
                          <option value="video">Video</option>
                          <option value="other">Other</option>
                        </Select>
                      </FormField>
                      <FormField id="languageCodeDisplay" label="Language">
                        <Select
                          id="languageCodeDisplay"
                          value={languageCode}
                          onChange={(event) => setLanguageCode(event.target.value)}
                        >
                          {COMMUNICATION_LANGUAGES.map((language) => (
                            <option key={language.code} value={language.code}>
                              {language.name}
                            </option>
                          ))}
                        </Select>
                      </FormField>
                    </div>
                    <FormField id="visibility" label="Visibility">
                      <Select
                        id="visibility"
                        name="visibility"
                        value={visibility}
                        onChange={(event) => {
                          setVisibility(event.target.value);
                          if (event.target.value === "family_visible") {
                            setAcknowledgementRequested(true);
                          }
                        }}
                      >
                        <option value="family_visible">Family visible</option>
                        <option value="internal">Internal</option>
                        <option value="restricted_admin">Restricted admin</option>
                      </Select>
                    </FormField>
                    {visibility === "family_visible" ? (
                      <FormField id="ackRequested" label="Request parent e-signature">
                        <Select
                          id="ackRequested"
                          name="acknowledgementRequested"
                          value={acknowledgementRequested ? "true" : "false"}
                          onChange={(event) =>
                            setAcknowledgementRequested(event.target.value === "true")
                          }
                        >
                          <option value="true">
                            Yes — trap communication and collect receipt signature
                          </option>
                          <option value="false">Not for this log</option>
                        </Select>
                      </FormField>
                    ) : (
                      <input type="hidden" name="acknowledgementRequested" value="false" />
                    )}
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
                    <FormField id="summary" label="Message body">
                      <Textarea
                        id="summary"
                        name="summary"
                        required
                        value={summary}
                        onChange={(event) => setSummary(event.target.value)}
                      />
                    </FormField>
                    <p className="text-muted text-sm">
                      Current language: {communicationLanguageLabel(languageCode)}. Use the Template
                      & language tab to translate English drafts. After saving a family-visible
                      note, use Parent e-signature below to create a sign link or capture a
                      signature.
                    </p>
                    {translateMessage ? (
                      <Alert title="Draft language status" tone="info">
                        {translateMessage}
                      </Alert>
                    ) : null}
                    <Button type="submit" disabled={students.length === 0}>
                      Save communication
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <Alert title="Permission needed" tone="warning">
                Communication entry requires an authorized role.
              </Alert>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
