/**
 * Privacy-aware aggregate suppression for Administrative Intelligence.
 * Threshold is a conservative product default — not a legal standard.
 */

export const DEFAULT_MIN_GROUP_SIZE = 5;

export type SuppressionResult = {
  suppressed: boolean;
  value: number | null;
  display: string;
};

export function suppressCount(
  value: number | null | undefined,
  minGroupSize: number = DEFAULT_MIN_GROUP_SIZE,
): SuppressionResult {
  if (value === null || value === undefined) {
    return { suppressed: false, value: null, display: "No finalized record found" };
  }
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return { suppressed: false, value: null, display: "Additional data may be needed" };
  }
  if (n > 0 && n < minGroupSize) {
    return { suppressed: true, value: null, display: "Suppressed to protect privacy." };
  }
  return { suppressed: false, value: n, display: String(n) };
}

/** Rates are suppressed when the denominator is below the threshold. */
export function suppressRate(
  numerator: number | null | undefined,
  denominator: number | null | undefined,
  minGroupSize: number = DEFAULT_MIN_GROUP_SIZE,
): SuppressionResult {
  if (denominator === null || denominator === undefined) {
    return { suppressed: false, value: null, display: "Additional data may be needed" };
  }
  if (Number(denominator) < minGroupSize) {
    return { suppressed: true, value: null, display: "Suppressed to protect privacy." };
  }
  if (numerator === null || numerator === undefined) {
    return { suppressed: false, value: null, display: "No finalized record found" };
  }
  const rate = Math.round((Number(numerator) / Number(denominator)) * 1000) / 10;
  return { suppressed: false, value: rate, display: `${rate}%` };
}

export function suppressionNotice(minGroupSize: number = DEFAULT_MIN_GROUP_SIZE): string {
  return `Aggregate values below the configured privacy threshold (n < ${minGroupSize}) are suppressed. This threshold is a product privacy control, not a legal standard.`;
}
