import { round3 } from './round.helpers';

export function safeProportion(part: number, whole: number): number {
  if (!whole) {
    return 1;
  }
  return part / whole;
}

export function proportionalAmount(
  amount: number,
  part: number,
  whole: number,
): number {
  if (!whole) {
    return round3(amount);
  }
  return round3(amount * (part / whole));
}
