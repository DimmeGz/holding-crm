import { PayerType } from '../../libs/enums';

export function transportForPayer(
  transportAmount: number,
  payer: string | undefined | null,
  expectedPayer: PayerType,
): number {
  if (payer === expectedPayer) {
    return Number(transportAmount) || 0;
  }
  return 0;
}
