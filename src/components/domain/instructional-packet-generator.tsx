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
import { openPrintablePacket } from "@/lib/worksheet-generator/print";
import { hasVisualMarkers, replaceVisualMarkersWithSvg } from "@/lib/worksheet-generator/visuals";

const DIFFICULTY_LABELS: Record<PacketDifficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
  errorless: "Errorless learning",
  task_analysis: "Task analysis",
  aba: "ABA style",
  udl: "UDL style",
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

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
  const [packet, setPacket] = useState<GeneratedInstructionalPacket | null>(null);
  const [printContent, setPrintContent] = useState<string | null>(null);
  const [printMessage, setPrintMessage] = useState<string | null>(null);
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

  const visualPreviewHtml = useMemo(() => {
    if (!printContent) return "";
    const sample = printContent.split("---------- PAGE BREAK ----------").slice(0, 3).join("\n\n");
    return replaceVisualMarkersWithSvg(escapeHtml(sample)).replaceAll("\n", "<br/>");
  }, [printContent]);

  function downloadAsPdf() {
    if (!packet || !printContent) return;
    setPrintMessage(null);
    const result = openPrintablePacket({
      title: packet.title,
      content: printContent,
      printingFormat: "Standard",
      autoPrint: true,
    });
    if (!result.ok) {
      setPrintMessage(result.message);
      return;
    }
    setPrintMessage(
      "Print dialog opened. Choose Destination: Save as PDF (or Microsoft Print to PDF), then save.",
    );
  }

  return (
    <div className="space-y-6">
      <Alert title="Student packet → printable PDF" tone="info">
        Generate student pages with real coin/theme drawings, then use{" "}
        <strong>Download as PDF</strong> to print. Teacher how-to pages are not included.
      </Alert>

      <Card>
        <CardTitle>Learner profile</CardTitle>
        <CardDescription>
          Example loaded: Grade 7 · Moderate Autism · 2nd-grade reading · coin goals · Space
          interest.
        </CardDescription>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <FormField id="studentCode" label="Student code">
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
        <CardTitle>Difficulty / length</CardTitle>
        <CardDescription>
          Choose the track and about how many student pages to generate.
        </CardDescription>
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
              setPrintMessage(null);
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
                if (!result.ok || !result.packet) {
                  setError(result.message ?? "Could not generate packet.");
                  setPacket(null);
                  setPrintContent(null);
                  return;
                }
                setPacket(result.packet);
                setPrintContent(result.plainText ?? null);
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

      {error ? (
        <Alert title="Generation note" tone="warning">
          {error}
        </Alert>
      ) : null}
      {printMessage ? (
        <Alert title="Print / PDF" tone="info">
          {printMessage}
        </Alert>
      ) : null}

      {packet && printContent ? (
        <Card>
          <CardTitle>
            {packet.title} · {packet.estimatedPages} pages
          </CardTitle>
          <CardDescription className="whitespace-pre-wrap">{packet.overview}</CardDescription>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" onClick={downloadAsPdf}>
              Download as PDF
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPrintMessage(null);
                const result = openPrintablePacket({
                  title: packet.title,
                  content: printContent,
                  printingFormat: "Standard",
                  autoPrint: false,
                });
                setPrintMessage(
                  result.ok
                    ? "Printable packet opened. Use Print → Save as PDF when ready."
                    : result.message,
                );
              }}
            >
              Open printable preview
            </Button>
          </div>
          <p className="text-muted mt-2 text-xs">
            “Download as PDF” opens the print dialog — choose Destination: Save as PDF. Drawings
            print with the pages.
          </p>

          {hasVisualMarkers(printContent) ? (
            <div className="border-border mt-4 rounded-[var(--radius-md)] border p-3">
              <p className="text-sm font-semibold">Visual preview (first pages)</p>
              <p className="text-muted mt-1 text-xs">
                These drawings are included when you save as PDF.
              </p>
              <div
                className="mt-3 max-h-80 overflow-auto rounded-[var(--radius-md)] p-3 text-sm text-black [&_figcaption]:text-xs [&_figure]:mr-3 [&_figure]:inline-block [&_svg]:max-w-full"
                style={{ background: "#fff" }}
                dangerouslySetInnerHTML={{ __html: visualPreviewHtml }}
              />
            </div>
          ) : null}

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
                    {type.replaceAll("_", " ")} (
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
        <CardTitle>What you get</CardTitle>
        <CardDescription>
          Student cover · coin/theme visuals · cut-and-paste · games · practice · check-ups — ready
          to print as PDF. For stronger AI-written worksheet pages, also use Worksheet Generator
          with an OpenAI API key (see docs/AI_API_KEY_SETUP.md). A ChatGPT Plus login cannot be
          synced here.
        </CardDescription>
      </Card>
    </div>
  );
}
