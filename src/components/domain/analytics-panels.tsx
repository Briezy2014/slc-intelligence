import { TableShell } from "@/components/data-display/table-shell";
import { Alert } from "@/components/ui/alert";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { DataSufficiency, ObservationPoint } from "@/lib/analytics/calculations";
import {
  comparePhases,
  describeSeries,
  movingAverage,
  promptLevelDistribution,
  rateOfImprovement,
} from "@/lib/analytics/calculations";

export function DataSufficiencyPanel({ sufficiency }: { sufficiency: DataSufficiency }) {
  if (sufficiency.status === "ok") {
    return <Alert title="Data sufficiency" tone="neutral">Enough compatible finalized data exists for this calculation.</Alert>;
  }

  return <Alert title="Data sufficiency" tone="warning">{sufficiency.reason}</Alert>;
}

export function CalculationExplanationPanel() {
  return (
    <Card>
      <CardTitle>Calculation notes</CardTitle>
      <CardDescription>
        Draft and archived sessions are excluded from analytics. Trend uses ordinary least squares
        across finalized/corrected observations in date order. No automated recommendation or
        high-stakes decision is generated.
      </CardDescription>
    </Card>
  );
}

export function DataQualityPanel({ points }: { points: ObservationPoint[] }) {
  const draftCount = points.filter((point) => point.status === "draft").length;
  const missingValueCount = points.filter((point) => point.value === null).length;

  return (
    <Card>
      <CardTitle>Data quality</CardTitle>
      <CardDescription>
        {draftCount} draft observations and {missingValueCount} observations without a numeric
        value are excluded or marked unavailable in calculations.
      </CardDescription>
    </Card>
  );
}

export function GoalProgressChart({
  title,
  points,
  higherIsBetter,
}: {
  title: string;
  points: ObservationPoint[];
  higherIsBetter: boolean;
}) {
  const series = describeSeries(points);
  const trend = rateOfImprovement(points, higherIsBetter);
  const values = series.values;
  const averages = movingAverage(values);
  const prompts = promptLevelDistribution(points);
  const firstPhase = points.find((point) => point.phaseId)?.phaseId ?? null;
  const secondPhase =
    points.find((point) => point.phaseId && point.phaseId !== firstPhase)?.phaseId ?? null;
  const phaseComparison =
    firstPhase && secondPhase ? comparePhases(points, firstPhase, secondPhase) : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {series.count} finalized/corrected observations. Trend direction is {trend.direction} with
          slope {trend.value}. This is a calculated summary, not an alert.
        </CardDescription>
      </Card>
      <DataSufficiencyPanel sufficiency={series.sufficiency} />
      <DataQualityPanel points={points} />
      <TableShell
        caption={`${title} data table`}
        headers={["Date", "Value", "Measurement", "Status", "Moving average"]}
        rows={points.map((point, index) => [
          point.date,
          point.value === null ? "No numeric value" : String(point.value),
          point.measurementType.replaceAll("_", " "),
          point.status ?? "finalized",
          averages[index] === undefined ? "Not available" : String(averages[index]),
        ])}
      />
      <TableShell
        caption="Prompt level distribution"
        headers={["Prompt level", "Finalized/corrected count"]}
        rows={Object.entries(prompts).map(([level, count]) => [level, String(count)])}
      />
      {phaseComparison ? (
        <TableShell
          caption="Phase comparison"
          headers={["Phase", "Observation count", "Mean"]}
          rows={[
            [firstPhase ?? "Phase A", String(phaseComparison.phaseA.count), String(phaseComparison.phaseA.mean ?? "Unavailable")],
            [secondPhase ?? "Phase B", String(phaseComparison.phaseB.count), String(phaseComparison.phaseB.mean ?? "Unavailable")],
          ]}
        />
      ) : null}
      <CalculationExplanationPanel />
    </div>
  );
}
