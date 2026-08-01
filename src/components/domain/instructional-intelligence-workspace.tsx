"use client";

import { useEffect, useMemo, useState, useTransition, type ChangeEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  runConsistencyCheckAction,
  runGoalNeedMatchAction,
  runInstructionalPlanAction,
  runMeasurableGoalCheckAction,
  runMeetingPrepAction,
  runParaSupportsExplainerAction,
  runParentFriendlySummaryAction,
  runPresentLevelsDraftAction,
  type InstructionalToolResult,
} from "@/lib/actions/instructional-intelligence";
import {
  INSTRUCTIONAL_CAPABILITIES,
  INSTRUCTIONAL_STATUS_LABEL,
  INSTRUCTIONAL_TOOLS,
  type InstructionalToolId,
} from "@/lib/instructional-intelligence/matrix";
import { cn } from "@/lib/utilities";

const TOOL_IDS = new Set<string>(INSTRUCTIONAL_TOOLS.map((tool) => tool.id));

const DEMO_SAMPLES: Record<InstructionalToolId, Record<string, string>> = {
  "present-levels": {
    focusArea: "reading fluency",
    evidence:
      "S3 greets peers independently at arrival.\nS3 reads 42 wcpm on a 2nd-grade probe (3/12).\nNeeds support with multi-step directions and decoding multisyllabic words.\nWhen given a visual schedule, S3 completes the first two routine steps with one prompt.",
  },
  "goal-need-match": {
    needsText:
      "Needs support with reading fluency\nNeeds help requesting a break\nNeeds practice following 2-step directions",
    goalIdeasText:
      "Given a grade-level passage, S3 will read 70 wcpm with 95% accuracy on 3 consecutive probes.\nUnrelated math computation goal.",
  },
  "measurable-goal": {
    goalStatement: "Student will improve reading and do better in class.",
  },
  "consistency-check": {
    etrText: "S3 has difficulty with reading fluency and decoding multisyllabic words.",
    iepText:
      "Present levels note classroom participation. Goal: S3 will raise hand to request help.",
    progressText: "S3 raised hand more often this quarter.",
  },
  "parent-friendly": {
    technicalText:
      "The PLAAFP shows baseline oral reading fluency of 42 wcpm with 78% accuracy. Specially designed instruction will target decoding and fluency using repeated reading.",
  },
  "instructional-plan": {
    goalStatement:
      "Given a break card and adult proximity, S3 will request a break using the card in 4 of 5 opportunities across 3 consecutive days.",
    setting: "small group",
  },
  "para-supports": {
    supportsText:
      "Preferential seating near instruction\nVisual schedule with first/then\nBreak card available during independent work\nChunk multi-step directions",
  },
  "meeting-prep": {
    focusArea: "Annual IEP review — literacy & self-advocacy",
    strengths: "Greets peers; uses visual schedule with one prompt; engaged in preferred reading.",
    needs: "Reading fluency; requesting breaks; following 2-step directions.",
    progressNotes: "Break-card use improved from 1/5 to 3/5 opportunities this quarter.",
    familyQuestions: "How can we practice break requests at home?",
  },
};

function ResultBlock({ result }: { result: InstructionalToolResult | null }) {
  if (!result) return null;
  return (
    <Alert
      title={result.ok ? result.title : "Could not run tool"}
      tone={result.ok ? "info" : "warning"}
    >
      {result.message ? <p className="mb-2">{result.message}</p> : null}
      {result.draftText ? (
        <pre className="text-sm whitespace-pre-wrap">{result.draftText}</pre>
      ) : null}
    </Alert>
  );
}

function parseTool(value: string | null): InstructionalToolId {
  if (value && TOOL_IDS.has(value)) return value as InstructionalToolId;
  return "present-levels";
}

function parseTab(value: string | null): "tools" | "howto" {
  return value === "howto" ? "howto" : "tools";
}

export function InstructionalIntelligenceWorkspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = parseTab(searchParams.get("tab"));
  const activeTool = parseTool(searchParams.get("tool"));

  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<InstructionalToolResult | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  useEffect(() => {
    setResult(null);
    setFields({});
  }, [activeTool]);

  const toolMeta = useMemo(
    () => INSTRUCTIONAL_TOOLS.find((tool) => tool.id === activeTool) ?? INSTRUCTIONAL_TOOLS[0],
    [activeTool],
  );

  const capabilityForTool = INSTRUCTIONAL_CAPABILITIES.find((item) => item.toolId === activeTool);

  const setQuery = (next: { tab?: "tools" | "howto"; tool?: InstructionalToolId }) => {
    const params = new URLSearchParams(searchParams.toString());
    const tab = next.tab ?? activeTab;
    const tool = next.tool ?? activeTool;
    if (tab === "tools") params.delete("tab");
    else params.set("tab", tab);
    params.set("tool", tool);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const run = (fn: () => Promise<InstructionalToolResult>) => {
    setResult(null);
    startTransition(async () => setResult(await fn()));
  };

  const fillSample = () => {
    setFields(DEMO_SAMPLES[activeTool] ?? {});
    setResult(null);
  };

  const field = (name: string) => fields[name] ?? "";
  const onField = (name: string) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((prev) => ({ ...prev, [name]: event.target.value }));

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Instructional intelligence sections"
        className="border-border flex gap-1 rounded-[var(--radius-md)] border p-1"
      >
        {(
          [
            { id: "tools" as const, label: "Tools" },
            { id: "howto" as const, label: "How to use (SOP)" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={cn(
              "min-h-10 flex-1 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold transition-colors",
              activeTab === tab.id
                ? "bg-accent-soft text-foreground"
                : "text-muted hover:bg-surface-subtle hover:text-foreground",
            )}
            onClick={() => setQuery({ tab: tab.id })}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "howto" ? (
        <section className="space-y-4" role="tabpanel">
          <Card>
            <CardTitle>Daily workflow</CardTitle>
            <CardDescription className="mt-2 space-y-2 text-sm">
              <p>
                1. Start in Command Center for the day&apos;s schedule and missing-data signals.
              </p>
              <p>2. Enter progress under Rapid Progress; keep Goals current.</p>
              <p>
                3. Use Instructional Intelligence tools (this page) when drafting or checking IEP
                language.
              </p>
              <p>4. Send home-ready language through Family Communication after review.</p>
            </CardDescription>
          </Card>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">How to use each tool</h2>
            {INSTRUCTIONAL_CAPABILITIES.map((item) => (
              <article
                key={item.id}
                className="border-border rounded-[var(--radius-md)] border p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <Link
                    href={item.href}
                    className="text-highlight text-sm font-semibold underline"
                    onClick={(event) => {
                      if (item.toolId) {
                        event.preventDefault();
                        setQuery({ tab: "tools", tool: item.toolId });
                      }
                    }}
                  >
                    Open
                  </Link>
                </div>
                <p className="text-muted mt-1 text-sm">{item.body}</p>
                <p className="text-highlight mt-2 text-xs font-semibold tracking-wide uppercase">
                  {INSTRUCTIONAL_STATUS_LABEL[item.status]}
                </p>
                <p className="text-foreground mt-3 text-sm whitespace-pre-wrap">{item.howTo}</p>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="space-y-4" role="tabpanel">
          <p className="text-muted text-sm">
            Pick a tool, paste your notes, run it, then review the draft.
          </p>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
            <nav aria-label="Instructional tools" className="space-y-1">
              {INSTRUCTIONAL_TOOLS.map((tool) => {
                const active = tool.id === activeTool;
                return (
                  <Link
                    key={tool.id}
                    href={`/instructional-intelligence?tool=${tool.id}`}
                    className={cn(
                      "block rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-accent-soft text-foreground ring-1 ring-[rgb(139_61_255/0.35)]"
                        : "text-muted hover:bg-surface-subtle hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      setQuery({ tab: "tools", tool: tool.id });
                    }}
                  >
                    {tool.shortLabel}
                  </Link>
                );
              })}
              <div className="border-border mt-3 space-y-1 border-t pt-3">
                <p className="text-muted px-3 pb-1 text-[11px] font-semibold tracking-wide uppercase">
                  Related pages
                </p>
                {[
                  { href: "/instructional-packets", label: "Instructional packets" },
                  { href: "/worksheet-generator", label: "Worksheet generator" },
                  { href: "/para-supports", label: "Para supports page" },
                  { href: "/interventions", label: "Interventions" },
                  { href: "/ai-assist", label: "AI Assist" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted hover:bg-surface-subtle hover:text-foreground block rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="space-y-4">
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{toolMeta.title}</CardTitle>
                    <CardDescription className="mt-2">{toolMeta.description}</CardDescription>
                    {capabilityForTool ? (
                      <p className="text-highlight mt-2 text-xs font-semibold tracking-wide uppercase">
                        {INSTRUCTIONAL_STATUS_LABEL[capabilityForTool.status]}
                      </p>
                    ) : null}
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={fillSample}>
                    Fill demo sample
                  </Button>
                </div>

                <div className="mt-4">
                  {activeTool === "present-levels" ? (
                    <form
                      className="space-y-3"
                      action={(formData) =>
                        run(() =>
                          runPresentLevelsDraftAction({
                            evidence: String(formData.get("evidence") ?? ""),
                            focusArea: String(formData.get("focusArea") ?? ""),
                          }),
                        )
                      }
                    >
                      <FormField id="plaafp-focus" label="Focus area">
                        <Input
                          id="plaafp-focus"
                          name="focusArea"
                          value={field("focusArea")}
                          onChange={onField("focusArea")}
                          placeholder="reading fluency, self-regulation…"
                        />
                      </FormField>
                      <FormField id="plaafp-evidence" label="Evidence notes">
                        <Textarea
                          id="plaafp-evidence"
                          name="evidence"
                          required
                          value={field("evidence")}
                          onChange={onField("evidence")}
                          placeholder="Strengths, needs, recent probes, classroom observations…"
                        />
                      </FormField>
                      <Button type="submit" disabled={pending}>
                        Draft present levels
                      </Button>
                    </form>
                  ) : null}

                  {activeTool === "goal-need-match" ? (
                    <form
                      className="space-y-3"
                      action={(formData) =>
                        run(() =>
                          runGoalNeedMatchAction({
                            needsText: String(formData.get("needsText") ?? ""),
                            goalIdeasText: String(formData.get("goalIdeasText") ?? ""),
                          }),
                        )
                      }
                    >
                      <FormField id="needs-text" label="Documented needs">
                        <Textarea
                          id="needs-text"
                          name="needsText"
                          required
                          value={field("needsText")}
                          onChange={onField("needsText")}
                          placeholder="One need per line…"
                        />
                      </FormField>
                      <FormField id="goal-ideas" label="Existing goal ideas (optional)">
                        <Textarea
                          id="goal-ideas"
                          name="goalIdeasText"
                          value={field("goalIdeasText")}
                          onChange={onField("goalIdeasText")}
                          placeholder="Paste current goal statements…"
                        />
                      </FormField>
                      <Button type="submit" disabled={pending}>
                        Match goals to needs
                      </Button>
                    </form>
                  ) : null}

                  {activeTool === "measurable-goal" ? (
                    <form
                      className="space-y-3"
                      action={(formData) =>
                        run(() =>
                          runMeasurableGoalCheckAction({
                            goalStatement: String(formData.get("goalStatement") ?? ""),
                          }),
                        )
                      }
                    >
                      <FormField id="goal-statement" label="Goal statement">
                        <Textarea
                          id="goal-statement"
                          name="goalStatement"
                          required
                          value={field("goalStatement")}
                          onChange={onField("goalStatement")}
                        />
                      </FormField>
                      <Button type="submit" disabled={pending}>
                        Check measurability
                      </Button>
                    </form>
                  ) : null}

                  {activeTool === "consistency-check" ? (
                    <form
                      className="space-y-3"
                      action={(formData) =>
                        run(() =>
                          runConsistencyCheckAction({
                            etrText: String(formData.get("etrText") ?? ""),
                            iepText: String(formData.get("iepText") ?? ""),
                            progressText: String(formData.get("progressText") ?? ""),
                          }),
                        )
                      }
                    >
                      <FormField id="etr-text" label="ETR / evaluation excerpt">
                        <Textarea
                          id="etr-text"
                          name="etrText"
                          value={field("etrText")}
                          onChange={onField("etrText")}
                        />
                      </FormField>
                      <FormField id="iep-text" label="IEP excerpt">
                        <Textarea
                          id="iep-text"
                          name="iepText"
                          value={field("iepText")}
                          onChange={onField("iepText")}
                        />
                      </FormField>
                      <FormField id="progress-text" label="Progress report excerpt">
                        <Textarea
                          id="progress-text"
                          name="progressText"
                          value={field("progressText")}
                          onChange={onField("progressText")}
                        />
                      </FormField>
                      <Button type="submit" disabled={pending}>
                        Run consistency check
                      </Button>
                    </form>
                  ) : null}

                  {activeTool === "parent-friendly" ? (
                    <form
                      className="space-y-3"
                      action={(formData) =>
                        run(() =>
                          runParentFriendlySummaryAction({
                            technicalText: String(formData.get("technicalText") ?? ""),
                          }),
                        )
                      }
                    >
                      <FormField id="technical-text" label="Technical language">
                        <Textarea
                          id="technical-text"
                          name="technicalText"
                          required
                          value={field("technicalText")}
                          onChange={onField("technicalText")}
                        />
                      </FormField>
                      <Button type="submit" disabled={pending}>
                        Make parent-friendly
                      </Button>
                    </form>
                  ) : null}

                  {activeTool === "instructional-plan" ? (
                    <form
                      className="space-y-3"
                      action={(formData) =>
                        run(() =>
                          runInstructionalPlanAction({
                            goalStatement: String(formData.get("goalStatement") ?? ""),
                            setting: String(formData.get("setting") ?? ""),
                          }),
                        )
                      }
                    >
                      <FormField id="plan-goal" label="IEP goal">
                        <Textarea
                          id="plan-goal"
                          name="goalStatement"
                          required
                          value={field("goalStatement")}
                          onChange={onField("goalStatement")}
                        />
                      </FormField>
                      <FormField id="plan-setting" label="Setting">
                        <Input
                          id="plan-setting"
                          name="setting"
                          value={field("setting")}
                          onChange={onField("setting")}
                          placeholder="small group, classroom…"
                        />
                      </FormField>
                      <Button type="submit" disabled={pending}>
                        Create instructional plan
                      </Button>
                    </form>
                  ) : null}

                  {activeTool === "para-supports" ? (
                    <form
                      className="space-y-3"
                      action={(formData) =>
                        run(() =>
                          runParaSupportsExplainerAction({
                            supportsText: String(formData.get("supportsText") ?? ""),
                          }),
                        )
                      }
                    >
                      <FormField id="supports-text" label="Approved accommodations / supports">
                        <Textarea
                          id="supports-text"
                          name="supportsText"
                          required
                          value={field("supportsText")}
                          onChange={onField("supportsText")}
                          placeholder="One support per line…"
                        />
                      </FormField>
                      <Button type="submit" disabled={pending}>
                        Explain for paraprofessionals
                      </Button>
                    </form>
                  ) : null}

                  {activeTool === "meeting-prep" ? (
                    <form
                      className="space-y-3"
                      action={(formData) =>
                        run(() =>
                          runMeetingPrepAction({
                            focusArea: String(formData.get("focusArea") ?? ""),
                            strengths: String(formData.get("strengths") ?? ""),
                            needs: String(formData.get("needs") ?? ""),
                            progressNotes: String(formData.get("progressNotes") ?? ""),
                            familyQuestions: String(formData.get("familyQuestions") ?? ""),
                          }),
                        )
                      }
                    >
                      <FormField id="meeting-focus" label="Meeting focus">
                        <Input
                          id="meeting-focus"
                          name="focusArea"
                          value={field("focusArea")}
                          onChange={onField("focusArea")}
                        />
                      </FormField>
                      <FormField id="meeting-strengths" label="Strengths">
                        <Textarea
                          id="meeting-strengths"
                          name="strengths"
                          value={field("strengths")}
                          onChange={onField("strengths")}
                        />
                      </FormField>
                      <FormField id="meeting-needs" label="Needs">
                        <Textarea
                          id="meeting-needs"
                          name="needs"
                          value={field("needs")}
                          onChange={onField("needs")}
                        />
                      </FormField>
                      <FormField id="meeting-progress" label="Progress notes">
                        <Textarea
                          id="meeting-progress"
                          name="progressNotes"
                          value={field("progressNotes")}
                          onChange={onField("progressNotes")}
                        />
                      </FormField>
                      <FormField id="meeting-family" label="Family questions">
                        <Textarea
                          id="meeting-family"
                          name="familyQuestions"
                          value={field("familyQuestions")}
                          onChange={onField("familyQuestions")}
                        />
                      </FormField>
                      <Button type="submit" disabled={pending}>
                        Generate meeting prep
                      </Button>
                    </form>
                  ) : null}
                </div>
              </Card>

              <ResultBlock result={result} />

              {capabilityForTool ? (
                <p className="text-muted text-sm">{capabilityForTool.howTo}</p>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
