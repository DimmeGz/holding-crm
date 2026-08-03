/** Match Django `round(value, 3)` for report totals/proportions. */
export function round3(value: number): number {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}
