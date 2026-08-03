import { round3 } from './round.helpers';

export type MonthDataSnapshot = {
  inQty: number;
  inSum: number;
  inVat: number;
  inTransport: number;
  inPay: number;
  outQty: number;
  outSum: number;
  outVat: number;
  outTransport: number;
  outPay: number;
  commission: number;
  commissionPay: number;
  commissionLeft: number;
  delta: number;
};

/** Type 3 hint: in_vat - out_vat from MonthData at month−2; null if missing. */
export function computeCountVatReturn(
  prior: { inVat: number; outVat: number } | null | undefined,
): number | null {
  if (!prior) {
    return null;
  }
  return Number(prior.inVat) - Number(prior.outVat);
}

export function emptySnapshot(): MonthDataSnapshot {
  return {
    inQty: 0,
    inSum: 0,
    inVat: 0,
    inTransport: 0,
    inPay: 0,
    outQty: 0,
    outSum: 0,
    outVat: 0,
    outTransport: 0,
    outPay: 0,
    commission: 0,
    commissionPay: 0,
    commissionLeft: 0,
    delta: 0,
  };
}

export function snapshotFromType0(totals: {
  qty: number;
  inSum: number;
  inPaySum: number;
  outSum: number;
  outPaySum: number;
  outTransportSum: number;
  comSum: number;
  comPaySum: number;
  comLeftSum: number;
  delta: number;
}): MonthDataSnapshot {
  return {
    ...emptySnapshot(),
    inQty: totals.qty,
    inSum: round3(totals.inSum),
    inPay: round3(totals.inPaySum),
    outSum: round3(totals.outSum),
    outPay: round3(totals.outPaySum),
    outTransport: round3(totals.outTransportSum),
    commission: round3(totals.comSum),
    commissionPay: round3(totals.comPaySum),
    commissionLeft: round3(totals.comLeftSum),
    delta: round3(totals.delta),
  };
}

export function snapshotFromType1(totals: {
  income: {
    qty: number;
    sum: number;
    vat: number;
    transport: number;
    pay: number;
  };
  outgoing: {
    qty: number;
    sum: number;
    vat: number;
    transport: number;
    pay: number;
  };
}): MonthDataSnapshot {
  return {
    ...emptySnapshot(),
    inQty: totals.income.qty,
    inSum: round3(totals.income.sum),
    inVat: round3(totals.income.vat),
    inTransport: round3(totals.income.transport),
    inPay: round3(totals.income.pay),
    outQty: totals.outgoing.qty,
    outSum: round3(totals.outgoing.sum),
    outVat: round3(totals.outgoing.vat),
    outTransport: round3(totals.outgoing.transport),
    outPay: round3(totals.outgoing.pay),
  };
}

/** Type 2 improvement over broken Django save: only in/out qty/sum. */
export function snapshotFromType2(totals: {
  inQty: number;
  inSum: number;
  outQty: number;
  outSum: number;
}): MonthDataSnapshot {
  return {
    ...emptySnapshot(),
    inQty: totals.inQty,
    inSum: round3(totals.inSum),
    outQty: totals.outQty,
    outSum: round3(totals.outSum),
  };
}

export function snapshotFromType3(totals: {
  inTotalQty: number;
  inSum: number;
  inVatSum: number;
  inTotalTransport: number;
  inPaySum: number;
  outTotalQty: number;
  outSum: number;
  outVatSum: number;
  outTotalTransport: number;
  outPaySum: number;
  outCost: number;
  doubledSum: number;
}): MonthDataSnapshot {
  const delta = round3(
    totals.outSum -
      totals.outCost -
      totals.outTotalTransport -
      totals.doubledSum,
  );
  return {
    ...emptySnapshot(),
    inQty: totals.inTotalQty,
    inSum: round3(totals.inSum),
    inVat: round3(totals.inVatSum),
    inTransport: round3(totals.inTotalTransport),
    inPay: round3(totals.inPaySum),
    outQty: totals.outTotalQty,
    outSum: round3(totals.outSum),
    outVat: round3(totals.outVatSum),
    outTransport: round3(totals.outTotalTransport),
    outPay: round3(totals.outPaySum),
    delta,
  };
}
