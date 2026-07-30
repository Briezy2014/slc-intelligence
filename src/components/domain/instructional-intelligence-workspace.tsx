"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
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
  INSTRUCTIONAL_POSITIONING,
  INSTRUCTIONAL_STATUS_LABEL,
} from "@/lib/instructional-intelligence/matrix";

function ResultBlock({ result }: { result: InstructionalToolResult | null }) {
  if (!result) return null;
  return (
    <Alert title={result.ok ? result.title : "Could not run tool"} tone={result.ok ? "info" : "warning"}>
      {result.message ? <p className="mb-2">{result.message}</p> : null}
      {result.draftText ? <pre className="whitespace-pre-wrap text-sm">{result.draftText}</pre> : null}
    </Alert>
  );
}

export function InstructionalIntelligenceWorkspace() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<InstructionalToolResult | null>(null);

  const run = (fn: () => Promise<InstructionalToolResult>) => {
    setResult(null);
    startTransition(async () => setResult(await fn()));
  };

  return (
    <div className="space-y-8">
      <Alert title="Instructional intelligence — human decisions retained" tone="info">
        {INSTRUCTIONAL_POSITIONING} These tools draft and flag for educator review. They do not determine
        eligibility, placement, or legal compliance.
      </Alert>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Capability map</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {INSTRUCTIONAL_CAPABILITIES.map((item) => (
            <Card key={item.title}>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription className="mt-2">{item.body}</CardDescription>
              <p className="text-highlight mt-3 text-xs font-semibold tracking-wide uppercase">
                {INSTRUCTIONAL_STATUS_LABEL[item.status]}
              </p>
              <p className="text-muted mt-1 text-xs">{item.where}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Coordinated programs (SPED · 504 · EL · MTSS)</h2>
        <Card>
          <CardDescription>
            Keep special education as the primary workspace while coordinating adjacent supports in one
            environment. Expanded 504 packaging and deeper MTSS automation can grow under district approval.
          </CardDescription>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/education-documents", label: "Special education docs", body: "IEP / ETR / progress drafts" },
              { href: "/education-documents", label: "504 / Gifted / EL drafts", body: "Assistive draft templates" },
              { href: "/interventions", label: "MTSS / intervention tier work", body: "Fidelity, dosage, progress" },
              { href: "/administrative-intelligence", label: "Admin readiness view", body: "Workflow dashboards" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="border-border hover:border-highlight/50 rounded-[var(--radius-md)] border p-3"
              >
                <p className="font-semibold">{item.label}</p>
                <p className="text-muted mt-1 text-sm">{item.body}</p>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardTitle>Draft present levels from evidence</CardTitle>
          <CardDescription>Paste district-approved notes/data. The draft will not invent scores.</CardDescription>
          <form
            className="mt-4 space-y-3"
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
              <Input id="plaafp-focus" name="focusArea" placeholder="reading fluency, self-regulation…" />
            </FormField>
            <FormField id="plaafp-evidence" label="Evidence notes">
              <Textarea
                id="plaafp-evidence"
                name="evidence"
                required
                placeholder="Strengths, needs, recent probes, classroom observations…"
              />
            </FormField>
            <Button type="submit" disabled={pending}>
              Draft present levels
            </Button>
          </form>
        </Card>

        <Card>
          <CardTitle>Match goals to documented needs</CardTitle>
          <CardDescription>Find coverage gaps between needs and goal ideas.</CardDescription>
          <form
            className="mt-4 space-y-3"
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
              <Textarea id="needs-text" name="needsText" required placeholder="One need per line…" />
            </FormField>
            <FormField id="goal-ideas" label="Existing goal ideas (optional)">
              <Textarea id="goal-ideas" name="goalIdeasText" placeholder="Paste current goal statements…" />
            </FormField>
            <Button type="submit" disabled={pending}>
              Match goals to needs
            </Button>
          </form>
        </Card>

        <Card>
          <CardTitle>Flag goals that are not measurable</CardTitle>
          <CardDescription>Checks vague language, missing conditions, and missing criteria.</CardDescription>
          <form
            className="mt-4 space-y-3"
            action={(formData) =>
              run(() =>
                runMeasurableGoalCheckAction({
                  goalStatement: String(formData.get("goalStatement") ?? ""),
                }),
              )
            }
          >
            <FormField id="goal-statement" label="Goal statement">
              <Textarea id="goal-statement" name="goalStatement" required />
            </FormField>
            <Button type="submit" disabled={pending}>
              Check measurability
            </Button>
          </form>
        </Card>

        <Card>
          <CardTitle>ETR · IEP · progress consistency check</CardTitle>
          <CardDescription>Drafting aid only — not a legal compliance determination.</CardDescription>
          <form
            className="mt-4 space-y-3"
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
              <Textarea id="etr-text" name="etrText" />
            </FormField>
            <FormField id="iep-text" label="IEP excerpt">
              <Textarea id="iep-text" name="iepText" />
            </FormField>
            <FormField id="progress-text" label="Progress report excerpt">
              <Textarea id="progress-text" name="progressText" />
            </FormField>
            <Button type="submit" disabled={pending}>
              Run consistency check
            </Button>
          </form>
        </Card>

        <Card>
          <CardTitle>Parent-friendly summary</CardTitle>
          <CardDescription>Translate technical language for home communication.</CardDescription>
          <form
            className="mt-4 space-y-3"
            action={(formData) =>
              run(() =>
                runParentFriendlySummaryAction({
                  technicalText: String(formData.get("technicalText") ?? ""),
                }),
              )
            }
          >
            <FormField id="technical-text" label="Technical language">
              <Textarea id="technical-text" name="technicalText" required />
            </FormField>
            <Button type="submit" disabled={pending}>
              Make parent-friendly
            </Button>
          </form>
        </Card>

        <Card>
          <CardTitle>Instructional plan from IEP goal</CardTitle>
          <CardDescription>Build an I do / We do / You do plan with para notes.</CardDescription>
          <form
            className="mt-4 space-y-3"
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
              <Textarea id="plan-goal" name="goalStatement" required />
            </FormField>
            <FormField id="plan-setting" label="Setting">
              <Input id="plan-setting" name="setting" placeholder="small group, classroom…" />
            </FormField>
            <Button type="submit" disabled={pending}>
              Create instructional plan
            </Button>
          </form>
        </Card>

        <Card>
          <CardTitle>Para-friendly approved supports</CardTitle>
          <CardDescription>Plain-language do/don’t guidance from approved supports.</CardDescription>
          <form
            className="mt-4 space-y-3"
            action={(formData) =>
              run(() =>
                runParaSupportsExplainerAction({
                  supportsText: String(formData.get("supportsText") ?? ""),
                }),
              )
            }
          >
            <FormField id="supports-text" label="Approved accommodations / supports">
              <Textarea id="supports-text" name="supportsText" required placeholder="One support per line…" />
            </FormField>
            <Button type="submit" disabled={pending}>
              Explain for paraprofessionals
            </Button>
          </form>
        </Card>

        <Card>
          <CardTitle>Meeting preparation summary</CardTitle>
          <CardDescription>Organize strengths, needs, progress, and family questions.</CardDescription>
          <form
            className="mt-4 space-y-3"
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
              <Input id="meeting-focus" name="focusArea" />
            </FormField>
            <FormField id="meeting-strengths" label="Strengths">
              <Textarea id="meeting-strengths" name="strengths" />
            </FormField>
            <FormField id="meeting-needs" label="Needs">
              <Textarea id="meeting-needs" name="needs" />
            </FormField>
            <FormField id="meeting-progress" label="Progress notes">
              <Textarea id="meeting-progress" name="progressNotes" />
            </FormField>
            <FormField id="meeting-family" label="Family questions">
              <Textarea id="meeting-family" name="familyQuestions" />
            </FormField>
            <Button type="submit" disabled={pending}>
              Generate meeting prep
            </Button>
          </form>
        </Card>
      </div>

      <ResultBlock result={result} />

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Already live nearby</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/interventions" className="text-highlight underline">
            Intervention fidelity & progress
          </Link>
          <Link href="/command-center" className="text-highlight underline">
            Overdue / missing data signals
          </Link>
          <Link href="/administrative-intelligence" className="text-highlight underline">
            Admin readiness dashboards
          </Link>
          <Link href="/ai-assist" className="text-highlight underline">
            AI Assist (human-reviewed drafting)
          </Link>
          <Link href="/para-supports" className="text-highlight underline">
            Para supports page
          </Link>
          <Link href="/capability-roadmap" className="text-highlight underline">
            Gated compliance packaging
          </Link>
        </div>
      </section>
    </div>
  );
}
