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
  groupCommunicationTemplatesByCategory,
} from "@/lib/catalogs";
import {
  enrichCommunicationDraftContext,
  familyFriendlyConcernLabel,
} from "@/lib/catalogs/behavior-communication";
import { getBehaviorDefinitionTemplate } from "@/lib/catalogs/behavior-templates";
import {
  COMMUNICATION_LANGUAGES,
  communicationLanguageLabel,
} from "@/lib/catalogs/communication-languages";
import { AiAssistPanel } from "@/components/domain/ai-assist-panel";
import { SpecificBehaviorSelect } from "@/components/domain/specific-behavior-select";
import type { Student, StudentContact } from "@/lib/supabase/types";

function studentName(student: Student) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}`;
}

function nowLocalDateTimeValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function toOccurredAtIso(localValue: string) {
  if (!localValue.trim()) return new Date().toISOString();
  const parsed = new Date(localValue);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

type ComposeTab = "compose" | "template_language";

export type FamilyCommunicationView = "dashboard" | "contacts" | "communications" | "templates";

export function ContactAndCommunicationForms({
  organizationId,
  students,
  contacts,
  canManageContacts,
  canEnterCommunication,
  studentId,
  view = "dashboard",
  communicationsBasePath = "/family-communication",
}: {
  organizationId: string;
  students: Student[];
  contacts: StudentContact[];
  canManageContacts: boolean;
  canEnterCommunication: boolean;
  studentId?: string;
  view?: FamilyCommunicationView;
  communicationsBasePath?: string;
}) {
  const visibleStudents = studentId
    ? students.filter((student) => student.id === studentId)
    : students;
  const [contactStudentId, setContactStudentId] = useState(studentId ?? "");
  const [logStudentId, setLogStudentId] = useState(studentId ?? "");
  const [contactId, setContactId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [behaviorTemplateId, setBehaviorTemplateId] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [sourceSummary, setSourceSummary] = useState("");
  const [visibility, setVisibility] = useState("family_visible");
  const [languageCode, setLanguageCode] = useState("en");
  const [method, setMethod] = useState("email");
  const [occurredAtLocal, setOccurredAtLocal] = useState(nowLocalDateTimeValue);
  const [acknowledgementRequested, setAcknowledgementRequested] = useState(true);
  const [composeTab, setComposeTab] = useState<ComposeTab>("template_language");
  const [translateMessage, setTranslateMessage] = useState<string | null>(null);
  const [contactMessage, setContactMessage] = useState<{
    tone: "success" | "danger";
    text: string;
  } | null>(null);
  const [saveMessage, setSaveMessage] = useState<{
    tone: "success" | "danger";
    text: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const contactsForStudent = useMemo(
    () =>
      logStudentId ? contacts.filter((contact) => contact.student_id === logStudentId) : contacts,
    [contacts, logStudentId],
  );

  const contactsForContactStudent = useMemo(
    () =>
      contactStudentId
        ? contacts.filter((contact) => contact.student_id === contactStudentId)
        : contacts,
    [contactStudentId, contacts],
  );

  const selectedStudent = visibleStudents.find((student) => student.id === logStudentId);
  const selectedContact = contactsForStudent.find((contact) => contact.id === contactId);

  const groupedTemplates = useMemo(() => {
    const needle = templateSearch.trim().toLowerCase();
    return groupCommunicationTemplatesByCategory()
      .map((group) => ({
        ...group,
        templates: group.templates.filter((template) => {
          if (!needle) return true;
          return (
            template.name.toLowerCase().includes(needle) ||
            template.subjectTemplate.toLowerCase().includes(needle) ||
            template.bodyTemplate.toLowerCase().includes(needle) ||
            template.category.toLowerCase().includes(needle)
          );
        }),
      }))
      .filter((group) => group.templates.length > 0);
  }, [templateSearch]);

  function selectBehavior(id: string) {
    setBehaviorTemplateId(id);
    const behavior = getBehaviorDefinitionTemplate(id);
    if (behavior) setFocusArea(familyFriendlyConcernLabel(behavior));
  }

  function selectTemplate(id: string) {
    setTemplateId(id);
    setComposeTab("template_language");
    setTranslateMessage(
      `Selected “${getCommunicationTemplate(id)?.name ?? "template"}”. Choose student/behavior if needed, then insert the draft.`,
    );
  }

  function insertDraft() {
    const template = getCommunicationTemplate(templateId);
    if (!template) return;
    const isBehaviorLetter =
      template.id.startsWith("behavior") ||
      template.id === "bus-behavior" ||
      template.id === "bullying-followup" ||
      template.id === "discipline-conference" ||
      template.id === "internal-behavior-debrief" ||
      template.id === "behavior-office-referral-followup" ||
      template.id === "behavior-reentry-plan";
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
        ? "English template inserted. Review the wording, set date/time, then save."
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

  const showContacts = view === "contacts";
  const showCommunications = view === "communications";
  const showTemplates = view === "templates";

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
          <strong>Contacts</strong> adds who can receive notes. <strong>Message templates</strong>{" "}
          shows dozens of ready-to-use family letters. <strong>Write a message</strong> opens
          compose, date/time tracking, and save. <strong>Messages for families</strong> is the
          ready-to-send checklist.
        </Alert>
      ) : null}

      {showTemplates ? (
        <div className="border-border bg-background-elevated space-y-4 rounded-[var(--radius-lg)] border p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Message templates</h3>
              <p className="text-muted mt-1 text-sm">
                {COMMUNICATION_TEMPLATES.length} professional school-to-home drafts. Choose one,
                then continue to Write a message to insert, edit, and save with date/time.
              </p>
            </div>
            <Link
              href={`${communicationsBasePath}/communications`}
              className="border-border bg-background-elevated hover:border-highlight/40 inline-flex min-h-11 items-center rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
            >
              Continue to Write a message
            </Link>
          </div>
          <FormField id="templateSearch" label="Search templates">
            <Input
              id="templateSearch"
              value={templateSearch}
              onChange={(event) => setTemplateSearch(event.target.value)}
              placeholder="Search progress, IEP, behavior, attendance…"
            />
          </FormField>
          {templateId ? (
            <Alert title="Template selected" tone="success">
              “{getCommunicationTemplate(templateId)?.name}” is selected. Open{" "}
              <Link
                href={`${communicationsBasePath}/communications`}
                className="font-semibold underline"
              >
                Write a message
              </Link>{" "}
              to insert the draft, set date/time, and save.
            </Alert>
          ) : null}
          <div className="space-y-5">
            {groupedTemplates.map((group) => (
              <div key={group.category}>
                <h4 className="text-foreground mb-2 font-semibold">{group.category}</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {group.templates.map((template) => (
                    <div
                      key={template.id}
                      className="border-border rounded-[var(--radius-md)] border p-3"
                    >
                      <p className="font-medium">{template.name}</p>
                      <p className="text-muted mt-1 line-clamp-3 text-sm whitespace-pre-wrap">
                        {template.bodyTemplate
                          .replaceAll("{{studentFirstName}}", "the student")
                          .replaceAll("{{contactFirstName}}", "family")
                          .replaceAll("{{staffName}}", "staff")
                          .replaceAll("{{focusArea}}", "the support focus")
                          .replaceAll(
                            "{{behaviorDescription}}",
                            "Professional concern description…",
                          )
                          .replaceAll("{{classroomSupports}}", "classroom supports")
                          .replaceAll("{{homePartnership}}", "Home partnership invitation.")}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button type="button" size="sm" onClick={() => selectTemplate(template.id)}>
                          Use this template
                        </Button>
                        <span className="text-muted self-center text-xs uppercase">
                          {template.method.replaceAll("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {groupedTemplates.length === 0 ? (
              <Alert title="No templates matched" tone="warning">
                Try a different search term.
              </Alert>
            ) : null}
          </div>
        </div>
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

      {showContacts ? (
        <div className="border-border bg-background-elevated rounded-[var(--radius-lg)] border p-4">
          <h3 className="text-lg font-semibold">Add a family contact</h3>
          <p className="text-muted mt-1 text-sm">
            Contacts are who can receive school-to-home messages for a student. Add email and/or
            phone so staff know how to reach them.
          </p>
          {canManageContacts ? (
            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setContactMessage(null);
                const form = event.currentTarget;
                const formData = new FormData(form);
                startTransition(async () => {
                  const result = await saveContactAction(formData);
                  setContactMessage({
                    tone: result.status === "success" ? "success" : "danger",
                    text: result.message ?? (result.status === "success" ? "Contact saved." : "Could not save contact."),
                  });
                  if (result.status === "success") {
                    form.reset();
                    if (studentId) setContactStudentId(studentId);
                  }
                });
              }}
            >
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
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField id="relationship" label="Relationship">
                  <Input
                    id="relationship"
                    name="relationship"
                    required
                    placeholder="Parent / guardian"
                  />
                </FormField>
                <FormField id="contactType" label="Contact type">
                  <Select id="contactType" name="contactType" defaultValue="family">
                    <option value="family">Family</option>
                    <option value="guardian">Guardian</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="agency">Agency</option>
                    <option value="other">Other</option>
                  </Select>
                </FormField>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField id="email" label="Email">
                  <Input id="email" name="email" type="email" placeholder="name@example.com" />
                </FormField>
                <FormField id="phonePrimary" label="Primary phone">
                  <Input id="phonePrimary" name="phonePrimary" type="tel" placeholder="(555) 555-5555" />
                </FormField>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField id="phoneSecondary" label="Secondary phone (optional)">
                  <Input id="phoneSecondary" name="phoneSecondary" type="tel" />
                </FormField>
                <FormField id="isPrimary" label="Primary contact for this student?">
                  <Select id="isPrimary" name="isPrimary" defaultValue="false">
                    <option value="false">No</option>
                    <option value="true">Yes — primary contact</option>
                  </Select>
                </FormField>
              </div>
              <FormField id="sensitiveNotes" label="Staff notes (optional, internal)">
                <Textarea
                  id="sensitiveNotes"
                  name="sensitiveNotes"
                  placeholder="Best times to call, preferred language, interpreter needs…"
                />
              </FormField>
              <input type="hidden" name="status" value="active" />
              <Button type="submit" disabled={pending || students.length === 0}>
                {pending ? "Saving…" : "Save contact"}
              </Button>
              {contactMessage ? (
                <Alert
                  title={contactMessage.tone === "success" ? "Contact saved" : "Could not save"}
                  tone={contactMessage.tone}
                >
                  {contactMessage.text}
                </Alert>
              ) : null}
            </form>
          ) : (
            <Alert title="Permission needed" tone="warning">
              Contact management requires an authorized role.
            </Alert>
          )}
          <div className="mt-6">
            <h4 className="font-semibold">Saved contacts</h4>
            {contactsForContactStudent.length === 0 ? (
              <p className="text-muted mt-2 text-sm">
                No contacts yet{contactStudentId ? " for this student" : ""}. Add one above.
              </p>
            ) : (
              <ul className="mt-3 divide-border divide-y">
                {contactsForContactStudent.map((contact) => {
                  const student = students.find((entry) => entry.id === contact.student_id);
                  return (
                    <li key={contact.id} className="py-3 text-sm">
                      <p className="font-medium">
                        {contact.last_name}, {contact.first_name}
                        {contact.is_primary ? " · Primary" : ""}
                      </p>
                      <p className="text-muted">
                        {contact.relationship} · {contact.contact_type}
                        {student ? ` · ${studentName(student)}` : ""}
                      </p>
                      <p className="text-muted">
                        {[contact.email, contact.phone_primary].filter(Boolean).join(" · ") ||
                          "No email/phone on file"}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}

      {showCommunications ? (
        <div className="border-border bg-background-elevated rounded-[var(--radius-lg)] border p-4">
          <h3 className="text-lg font-semibold">Write a message</h3>
          <p className="text-muted mt-1 text-sm">
            Choose a template, insert a professional draft, set the date and time this
            communication occurred, then save. Saved letters are tracked below.
          </p>
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
                <Link
                  href={`${communicationsBasePath}/templates`}
                  className="border-border bg-background-elevated hover:border-highlight/40 inline-flex min-h-11 items-center rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
                >
                  Browse all templates
                </Link>
              </div>

              {composeTab === "template_language" ? (
                <div className="space-y-3">
                  <Alert title="Choose template, behavior, and language" tone="info">
                    For behavior letters, pick a specific behavior from the dropdown. Then choose a
                    template and language, insert the English draft, and translate before saving.
                  </Alert>
                  <FormField id="draftTemplateId" label="Communication template">
                    <Select
                      id="draftTemplateId"
                      value={templateId}
                      onChange={(event) => setTemplateId(event.target.value)}
                    >
                      <option value="">Choose a communication template</option>
                      {groupCommunicationTemplatesByCategory().map((group) => (
                        <optgroup key={group.category} label={group.category}>
                          {group.templates.map((template) => (
                            <option key={template.id} value={template.id}>
                              {template.name}
                            </option>
                          ))}
                        </optgroup>
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
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSaveMessage(null);
                    const formData = new FormData(event.currentTarget);
                    formData.set("occurredAt", toOccurredAtIso(occurredAtLocal));
                    startTransition(async () => {
                      const result = await saveCommunicationLogAction(formData);
                      setSaveMessage({
                        tone: result.status === "success" ? "success" : "danger",
                        text:
                          result.message ??
                          (result.status === "success"
                            ? "Communication saved."
                            : "Could not save communication."),
                      });
                    });
                  }}
                >
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
                          {contact.email ? ` · ${contact.email}` : ""}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField
                    id="occurredAtLocal"
                    label="Date and time of this communication"
                    description="Tracked on the saved letter for your records."
                  >
                    <Input
                      id="occurredAtLocal"
                      type="datetime-local"
                      required
                      value={occurredAtLocal}
                      onChange={(event) => setOccurredAtLocal(event.target.value)}
                    />
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
                    <FormField id="ackRequested" label="Request parent receipt signature">
                      <Select
                        id="ackRequested"
                        name="acknowledgementRequested"
                        value={acknowledgementRequested ? "true" : "false"}
                        onChange={(event) =>
                          setAcknowledgementRequested(event.target.value === "true")
                        }
                      >
                        <option value="true">
                          Yes — collect a receipt signature after the family reads this
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
                    & language tab to translate English drafts. After saving a family-visible note,
                    use Parent e-signature below to create a sign link or capture a signature.
                  </p>
                  {translateMessage ? (
                    <Alert title="Draft language status" tone="info">
                      {translateMessage}
                    </Alert>
                  ) : null}
                  <Button type="submit" disabled={pending || students.length === 0}>
                    {pending ? "Saving…" : "Save communication"}
                  </Button>
                  {saveMessage ? (
                    <Alert
                      title={saveMessage.tone === "success" ? "Message saved" : "Could not save"}
                      tone={saveMessage.tone}
                    >
                      {saveMessage.text}
                    </Alert>
                  ) : null}
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
  );
}
