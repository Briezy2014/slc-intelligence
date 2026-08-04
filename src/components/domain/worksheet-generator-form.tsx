"use client";

import { useMemo, useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateWorksheetPacketAction } from "@/lib/actions/worksheet-generator";
import { replaceAiImageMarkers } from "@/lib/worksheet-generator/ai-images";
import {
  DIFFERENTIATION_LEVELS,
  GRADE_BANDS,
  INSTRUCTIONAL_LEVELS,
  PACKET_LENGTHS,
  PRINTING_FORMATS,
  SUPPORT_NEEDS,
  WORKSHEET_EDUCATOR_REVIEW_NOTE,
  WORKSHEET_PRIVACY_NOTICE,
  WORKSHEET_SUBJECTS,
  WORKSHEET_TYPES,
  selectRecommendedWorksheetTypes,
  type WorksheetType,
} from "@/lib/worksheet-generator/options";
import { downloadPrintableHtmlFile, openPrintablePacket } from "@/lib/worksheet-generator/print";
import { hasVisualMarkers, replaceVisualMarkersWithSvg } from "@/lib/worksheet-generator/visuals";

function toggleValue(list: string[], value: string, checked: boolean): string[] {
  if (checked) return list.includes(value) ? list : [...list, value];
  return list.filter((item) => item !== value);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function WorksheetGeneratorForm() {
  const [packetTitle, setPacketTitle] = useState("");
  const [subject, setSubject] = useState<(typeof WORKSHEET_SUBJECTS)[number]>("Math");
  const [topicOrSkill, setTopicOrSkill] = useState("Identifying coins");
  const [learningGoal, setLearningGoal] = useState(
    "The student will identify the name and value of a penny, nickel, dime, and quarter with 80% accuracy.",
  );
  const [gradeBand, setGradeBand] = useState<(typeof GRADE_BANDS)[number]>("Grades 6–8");
  const [instructionalLevel, setInstructionalLevel] =
    useState<(typeof INSTRUCTIONAL_LEVELS)[number]>("Grade 2");
  const [instructionalLevelCustom, setInstructionalLevelCustom] = useState("");
  const [differentiationLevel, setDifferentiationLevel] = useState<
    (typeof DIFFERENTIATION_LEVELS)[number]
  >("Level 2: Moderate Support");
  const [differentiationCustom, setDifferentiationCustom] = useState("");
  const [supportNeeds, setSupportNeeds] = useState<string[]>([
    "Visual supports",
    "Simplified directions",
    "Reduced answer choices",
  ]);
  const [worksheetTypes, setWorksheetTypes] = useState<string[]>([
    "Skill introduction",
    "Guided practice",
    "Independent practice",
    "Matching",
    "Multiple choice",
    "Answer key",
  ]);
  const [packetLength, setPacketLength] = useState<(typeof PACKET_LENGTHS)[number]>("10 pages");
  const [customPages, setCustomPages] = useState(10);
  const [studentInterestOrTheme, setStudentInterestOrTheme] = useState("Space");
  const [printingFormat, setPrintingFormat] =
    useState<(typeof PRINTING_FORMATS)[number]>("Standard");
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [includeProgressMonitoring, setIncludeProgressMonitoring] = useState(false);

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [printMessage, setPrintMessage] = useState<string | null>(null);
  const [resultTitle, setResultTitle] = useState("");
  const [resultContent, setResultContent] = useState("");
  const [imageAssets, setImageAssets] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const recommendedPreview = useMemo(
    () =>
      selectRecommendedWorksheetTypes({
        subject,
        learningGoal,
        instructionalLevel,
        differentiationLevel,
      }),
    [subject, learningGoal, instructionalLevel, differentiationLevel],
  );

  const previewHtml = useMemo(() => {
    if (!resultContent) return "";
    const firstPages = resultContent.split("---------- PAGE BREAK ----------").slice(0, 2);
    return firstPages
      .map((page) => {
        const escaped = escapeHtml(page.trim());
        return replaceAiImageMarkers(replaceVisualMarkersWithSvg(escaped), imageAssets).replaceAll(
          "\n",
          "<br/>",
        );
      })
      .join('<hr style="margin:16px 0;border-color:#444"/>');
  }, [resultContent, imageAssets]);

  function runGenerate() {
    setError(null);
    setMessage(null);
    setPrintMessage(null);
    startTransition(async () => {
      const result = await generateWorksheetPacketAction({
        packetTitle,
        subject,
        topicOrSkill,
        learningGoal,
        gradeBand,
        instructionalLevel,
        instructionalLevelCustom,
        differentiationLevel,
        differentiationCustom,
        supportNeeds: supportNeeds as Array<(typeof SUPPORT_NEEDS)[number]>,
        worksheetTypes: worksheetTypes as WorksheetType[],
        packetLength,
        customPages: packetLength === "Custom" ? customPages : undefined,
        studentInterestOrTheme,
        printingFormat,
        includeAnswerKey,
        includeProgressMonitoring,
      });
      if (!result.ok || !result.packet) {
        setError(result.message ?? "Could not generate the worksheet packet.");
        setShowResults(false);
        return;
      }
      setResultTitle(result.packet.title);
      setResultContent(result.packet.content);
      setImageAssets(result.packet.imageAssets ?? {});
      const hasAiImage = Boolean(
        result.packet.imageAssets && Object.keys(result.packet.imageAssets).length,
      );
      setMessage(
        hasAiImage
          ? "Packet ready with drawings and a theme illustration. Preview below, then Print / Save as PDF."
          : (result.message ??
              "Packet ready with printable drawings. Preview below, then Print / Save as PDF."),
      );
      setShowResults(true);
    });
  }

  function printPacket(autoPrint = true) {
    setPrintMessage(null);
    const result = openPrintablePacket({
      title: resultTitle,
      content: resultContent,
      printingFormat,
      autoPrint,
      imageAssets,
    });
    if (!result.ok) {
      setPrintMessage(result.message);
      return;
    }
    setPrintMessage(
      autoPrint
        ? "Print dialog opened. Choose “Save as PDF” (or your PDF printer) — pictures print with the pages."
        : "Printable packet opened in a new tab. Use Print → Save as PDF.",
    );
  }

  function downloadPdf() {
    printPacket(true);
  }

  function downloadHtml() {
    setPrintMessage(null);
    downloadPrintableHtmlFile({
      title: resultTitle,
      content: resultContent,
      printingFormat,
      imageAssets,
    });
    setPrintMessage(
      "Downloaded a printable HTML file with pictures embedded. Open it, then Print → Save as PDF if needed.",
    );
  }

  return (
    <div className="space-y-6">
      <Alert title="Privacy notice" tone="warning">
        {WORKSHEET_PRIVACY_NOTICE}
      </Alert>
      <Alert title="Before you print" tone="info">
        {WORKSHEET_EDUCATOR_REVIEW_NOTE}
      </Alert>

      {!showResults ? (
        <Card>
          <CardTitle>Worksheet packet options</CardTitle>
          <CardDescription>
            Enter a learning goal and options. Generate a printable packet with large drawings (and
            a theme illustration when your API key supports images), then Print or Save as PDF.
          </CardDescription>

          <div className="mt-4 space-y-4">
            <FormField id="packetTitle" label="Packet title (optional)">
              <Input
                id="packetTitle"
                value={packetTitle}
                onChange={(event) => setPacketTitle(event.target.value)}
                placeholder="Coin identification practice pack"
              />
            </FormField>

            <FormField id="subject" label="Subject">
              <Select
                id="subject"
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value as (typeof WORKSHEET_SUBJECTS)[number])
                }
              >
                {WORKSHEET_SUBJECTS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              id="topicOrSkill"
              label="Topic or skill"
              description="Examples: Identifying coins, Main idea, Reading grocery store signs"
            >
              <Input
                id="topicOrSkill"
                value={topicOrSkill}
                onChange={(event) => setTopicOrSkill(event.target.value)}
                required
              />
            </FormField>

            <FormField id="learningGoal" label="Learning goal">
              <Textarea
                id="learningGoal"
                value={learningGoal}
                onChange={(event) => setLearningGoal(event.target.value)}
                required
              />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField id="gradeBand" label="Grade band">
                <Select
                  id="gradeBand"
                  value={gradeBand}
                  onChange={(event) =>
                    setGradeBand(event.target.value as (typeof GRADE_BANDS)[number])
                  }
                >
                  {GRADE_BANDS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField id="instructionalLevel" label="Instructional level">
                <Select
                  id="instructionalLevel"
                  value={instructionalLevel}
                  onChange={(event) =>
                    setInstructionalLevel(
                      event.target.value as (typeof INSTRUCTIONAL_LEVELS)[number],
                    )
                  }
                >
                  {INSTRUCTIONAL_LEVELS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            {instructionalLevel === "Custom" ? (
              <FormField id="instructionalLevelCustom" label="Custom instructional level">
                <Input
                  id="instructionalLevelCustom"
                  value={instructionalLevelCustom}
                  onChange={(event) => setInstructionalLevelCustom(event.target.value)}
                />
              </FormField>
            ) : null}

            <FormField
              id="differentiationLevel"
              label="Differentiation level"
              description="Level 1 = maximum support; Level 2 = moderate support; Level 3 = minimal support."
            >
              <Select
                id="differentiationLevel"
                value={differentiationLevel}
                onChange={(event) =>
                  setDifferentiationLevel(
                    event.target.value as (typeof DIFFERENTIATION_LEVELS)[number],
                  )
                }
              >
                {DIFFERENTIATION_LEVELS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormField>

            {differentiationLevel === "Custom" ? (
              <FormField id="differentiationCustom" label="Custom differentiation">
                <Input
                  id="differentiationCustom"
                  value={differentiationCustom}
                  onChange={(event) => setDifferentiationCustom(event.target.value)}
                />
              </FormField>
            ) : null}

            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold">
                Support needs (select all that apply)
              </legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {SUPPORT_NEEDS.map((option) => (
                  <label key={option} className="flex items-start gap-2 text-sm">
                    <Checkbox
                      checked={supportNeeds.includes(option)}
                      onChange={(event) =>
                        setSupportNeeds(toggleValue(supportNeeds, option, event.target.checked))
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <legend className="text-sm font-semibold">Worksheet types</legend>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setWorksheetTypes(recommendedPreview)}
                >
                  Select Recommended
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {WORKSHEET_TYPES.map((option) => (
                  <label key={option} className="flex items-start gap-2 text-sm">
                    <Checkbox
                      checked={worksheetTypes.includes(option)}
                      onChange={(event) =>
                        setWorksheetTypes(toggleValue(worksheetTypes, option, event.target.checked))
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField id="packetLength" label="Packet length">
                <Select
                  id="packetLength"
                  value={packetLength}
                  onChange={(event) =>
                    setPacketLength(event.target.value as (typeof PACKET_LENGTHS)[number])
                  }
                >
                  {PACKET_LENGTHS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="printingFormat" label="Printing format">
                <Select
                  id="printingFormat"
                  value={printingFormat}
                  onChange={(event) =>
                    setPrintingFormat(event.target.value as (typeof PRINTING_FORMATS)[number])
                  }
                >
                  {PRINTING_FORMATS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            {packetLength === "Custom" ? (
              <FormField id="customPages" label="Custom page count">
                <Input
                  id="customPages"
                  type="number"
                  min={1}
                  max={40}
                  value={customPages}
                  onChange={(event) => setCustomPages(Number(event.target.value))}
                />
              </FormField>
            ) : null}

            <FormField
              id="studentInterestOrTheme"
              label="Student interest or theme (optional)"
              description="Examples: Space, Swimming, Sports, Animals, Cooking. Keep materials age-respectful. Theme visuals are included in Print/PDF."
            >
              <Input
                id="studentInterestOrTheme"
                value={studentInterestOrTheme}
                onChange={(event) => setStudentInterestOrTheme(event.target.value)}
              />
            </FormField>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={includeAnswerKey}
                  onChange={(event) => setIncludeAnswerKey(event.target.checked)}
                />
                Include answer key
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={includeProgressMonitoring}
                  onChange={(event) => setIncludeProgressMonitoring(event.target.checked)}
                />
                Include progress monitoring
              </label>
            </div>

            <Button type="button" disabled={pending} onClick={runGenerate}>
              {pending ? "Generating…" : "Generate Worksheet Packet"}
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <CardTitle>Generated worksheet packet</CardTitle>
          <CardDescription>
            Pictures appear in the preview and in Print / PDF. Student pages do not include AI
            disclaimer footers.
          </CardDescription>
          <div className="mt-4 space-y-3">
            <FormField id="resultTitle" label="Packet title">
              <Input
                id="resultTitle"
                value={resultTitle}
                onChange={(event) => setResultTitle(event.target.value)}
              />
            </FormField>

            {hasVisualMarkers(resultContent) || Object.keys(imageAssets).length ? (
              <div className="border-border rounded-[var(--radius-md)] border p-3">
                <p className="text-sm font-semibold">Picture preview (first pages)</p>
                <p className="text-muted mt-1 text-xs">
                  These drawings and illustrations are what students see when you print or save as
                  PDF. Do not copy the raw text box below if you need pictures — use Print / PDF /
                  HTML.
                </p>
                <div
                  className="mt-3 max-h-[28rem] overflow-auto rounded-[var(--radius-md)] p-4 text-sm text-black [&_figcaption]:mt-1 [&_figcaption]:text-xs [&_figcaption]:font-semibold [&_figure]:mr-4 [&_figure]:mb-3 [&_figure]:inline-block [&_img]:max-w-full [&_svg]:max-w-full"
                  style={{ background: "#fff" }}
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            ) : (
              <Alert title="No pictures found" tone="warning">
                Regenerate the packet to include printable drawings.
              </Alert>
            )}

            <FormField id="resultContent" label="Packet content (editable)">
              <Textarea
                id="resultContent"
                className="min-h-[28rem] font-mono text-sm"
                value={resultContent}
                onChange={(event) => setResultContent(event.target.value)}
              />
            </FormField>
            <div className="flex flex-wrap gap-2 print:hidden">
              <Button type="button" variant="secondary" onClick={() => setShowResults(false)}>
                Back to form
              </Button>
              <Button type="button" disabled={pending} onClick={runGenerate}>
                {pending ? "Regenerating…" : "Regenerate the packet"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => printPacket(true)}>
                Print the packet
              </Button>
              <Button type="button" onClick={downloadPdf}>
                Download as PDF
              </Button>
              <Button type="button" variant="ghost" onClick={downloadHtml}>
                Download printable HTML
              </Button>
            </div>
            <p className="text-muted text-xs">
              “Download as PDF” opens the print dialog — choose Destination: Save as PDF. Visuals
              print with the pages.
            </p>
          </div>
        </Card>
      )}

      {message ? (
        <Alert title="Ready" tone="info">
          {message}
        </Alert>
      ) : null}
      {printMessage ? (
        <Alert title="Print / PDF" tone="info">
          {printMessage}
        </Alert>
      ) : null}
      {error ? (
        <Alert title="Could not generate" tone="warning">
          {error}
        </Alert>
      ) : null}
    </div>
  );
}
