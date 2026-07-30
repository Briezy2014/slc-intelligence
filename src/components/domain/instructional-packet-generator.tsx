"use client";

import { useMemo, useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateInstructionalPacketAction } from "@/lib/actions/instructional-packets";
import { EXAMPLE_COIN_SPACE_PROFILE } from "@/lib/instructional-packets/generator";
import {
  PACKET_DIFFICULTIES,
  PACKET_SIZE_TARGETS,
  type GeneratedInstructionalPacket,
  type PacketDifficulty,
  type PacketSizeTarget,
} from "@/lib/instructional-packets/types";

const DIFFICULTY_LABELS: Record<PacketDifficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
  errorless: "Errorless learning",
  task_analysis: "Task analysis",
  aba: "ABA style",
  udl: "UDL style",
};

export function InstructionalPacketGenerator() {
  const example = EXAMPLE_COIN_SPACE_PROFILE;
  const [gradeLevel, setGradeLevel] = useState(example.gradeLevel);
  const [supportNeeds, setSupportNeeds] = useState(example.supportNeeds);
  const [readingLevel, setReadingLevel] = useState(example.readingLevel);
  const [skillGoal, setSkillGoal] = useState(example.skillGoal);
  const [iepGoal, setIepGoal] = useState(example.iepGoal);
  const [preferredInterests, setPreferredInterests] = useState(example.preferredInterests);
  const [studentCode, setStudentCode] = useState(example.studentCode ?? "S1");
  const [difficulty, setDifficulty] = useState<PacketDifficulty>("moderate");
  const [targetPages, setTargetPages] = useState<PacketSizeTarget>(40);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [packet, setPacket] = useState<GeneratedInstructionalPacket | null>(null);
  const [plainText, setPlainText] = useState<string | null>(null);
  const [previewFilter, setPreviewFilter] = useState<string>("all");

  const sectionTypes = useMemo(() => {
    if (!packet) return [];
    return Array.from(new Set(packet.sections.map((section) => section.sectionType)));
  }, [packet]);

  const previewSections = useMemo(() => {
    if (!packet) return [];
    if (previewFilter === "all") return packet.sections;
    return packet.sections.filter((section) => section.sectionType === previewFilter);
  }, [packet, previewFilter]);

  return (
    <div className="space-y-6">
      <Alert title="Educator-reviewed instructional packet drafts" tone="info">
        Enter a learner profile (use coded IDs in pilot). Choose difficulty/style and target length
        (30–100 pages). The generator builds visual supports, cut-and-paste, games, assessments,
        progress sheets, data forms, and answer keys. Review before printing or assigning.
      </Alert>

      <Card>
        <CardTitle>Learner profile</CardTitle>
        <CardDescription>
          Example loaded: Grade 7 · Moderate Autism · 2nd-grade reading · coin goals · Space
          interest.
        </CardDescription>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <FormField id="studentCode" label="Student code (pilot)">
            <Input
              id="studentCode"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
            />
          </FormField>
          <FormField id="gradeLevel" label="Grade">
            <Input
              id="gradeLevel"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
            />
          </FormField>
          <FormField id="supportNeeds" label="Support needs / profile">
            <Input
              id="supportNeeds"
              value={supportNeeds}
              onChange={(e) => setSupportNeeds(e.target.value)}
              placeholder="Moderate Autism"
            />
          </FormField>
          <FormField id="readingLevel" label="Reading level">
            <Input
              id="readingLevel"
              value={readingLevel}
              onChange={(e) => setReadingLevel(e.target.value)}
              placeholder="2nd grade"
            />
          </FormField>
          <FormField id="skillGoal" label="Skill goal">
            <Input
              id="skillGoal"
              value={skillGoal}
              onChange={(e) => setSkillGoal(e.target.value)}
            />
          </FormField>
          <FormField id="preferredInterests" label="Preferred interests">
            <Input
              id="preferredInterests"
              value={preferredInterests}
              onChange={(e) => setPreferredInterests(e.target.value)}
              placeholder="Space"
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField id="iepGoal" label="IEP goal">
              <Textarea id="iepGoal" value={iepGoal} onChange={(e) => setIepGoal(e.target.value)} />
            </FormField>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>Difficulty / instructional style</CardTitle>
        <CardDescription>Choose one primary track for this generation run.</CardDescription>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <FormField id="difficulty" label="Level or style">
            <Select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as PacketDifficulty)}
            >
              {PACKET_DIFFICULTIES.map((value) => (
                <option key={value} value={value}>
                  {DIFFICULTY_LABELS[value]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="targetPages" label="Target packet length">
            <Select
              id="targetPages"
              value={String(targetPages)}
              onChange={(e) => setTargetPages(Number(e.target.value) as PacketSizeTarget)}
            >
              {PACKET_SIZE_TARGETS.map((value) => (
                <option key={value} value={value}>
                  About {value} pages
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={pending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const result = await generateInstructionalPacketAction({
                  gradeLevel,
                  supportNeeds,
                  readingLevel,
                  skillGoal,
                  iepGoal,
                  preferredInterests,
                  studentCode,
                  difficulty,
                  targetPages,
                });
                setDisclaimer(result.disclaimer);
                if (!result.ok || !result.packet) {
                  setError(result.message ?? "Could not generate packet.");
                  setPacket(null);
                  setPlainText(null);
                  return;
                }
                setPacket(result.packet);
                setPlainText(result.plainText ?? null);
                setPreviewFilter("all");
              });
            }}
          >
            {pending ? "Generating…" : "Generate instructional packet"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => {
              setGradeLevel(example.gradeLevel);
              setSupportNeeds(example.supportNeeds);
              setReadingLevel(example.readingLevel);
              setSkillGoal(example.skillGoal);
              setIepGoal(example.iepGoal);
              setPreferredInterests(example.preferredInterests);
              setStudentCode(example.studentCode ?? "S1");
              setDifficulty("moderate");
              setTargetPages(40);
            }}
          >
            Reset to coin + space example
          </Button>
        </div>
      </Card>

      {disclaimer ? (
        <Alert title="Review before use" tone="info">
          {disclaimer}
        </Alert>
      ) : null}
      {error ? (
        <Alert title="Generation note" tone="warning">
          {error}
        </Alert>
      ) : null}

      {packet ? (
        <Card>
          <CardTitle>
            {packet.title} · {packet.estimatedPages} pages
          </CardTitle>
          <CardDescription className="whitespace-pre-wrap">{packet.overview}</CardDescription>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                if (!plainText) return;
                try {
                  await navigator.clipboard.writeText(plainText);
                } catch {
                  // ignore clipboard failures
                }
              }}
            >
              Copy full packet text
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (!plainText) return;
                const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `${packet.title.replaceAll(" ", "-").toLowerCase()}-packet.txt`;
                anchor.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download .txt
            </Button>
          </div>

          <div className="mt-4">
            <FormField id="previewFilter" label="Preview section filter">
              <Select
                id="previewFilter"
                value={previewFilter}
                onChange={(e) => setPreviewFilter(e.target.value)}
              >
                <option value="all">All pages ({packet.sections.length})</option>
                {sectionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type} (
                    {packet.sections.filter((section) => section.sectionType === type).length})
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="mt-4 max-h-[36rem] space-y-3 overflow-y-auto pr-1">
            {previewSections.map((section) => (
              <article
                key={`${section.pageNumber}-${section.title}`}
                className="border-border rounded-[var(--radius-md)] border p-3"
              >
                <p className="text-muted text-xs tracking-wide uppercase">
                  Page {section.pageNumber} · {section.sectionType.replaceAll("_", " ")}
                </p>
                <h3 className="mt-1 font-semibold">{section.title}</h3>
                <pre className="mt-2 text-sm whitespace-pre-wrap">{section.body}</pre>
              </article>
            ))}
          </div>
        </Card>
      ) : null}

      <Card>
        <CardTitle>What this packet includes</CardTitle>
        <CardDescription>
          Differentiated levels · visual supports · cut-and-paste · games · assessments · progress
          monitoring sheets · data collection forms · answer keys — with Easy / Moderate /
          Challenging / Errorless / Task analysis / ABA / UDL generation modes.
        </CardDescription>
      </Card>
    </div>
  );
}
