import { Invoice } from '../../documents/invoices/entities';
import { PayerType } from '../../libs/enums';
import {
  proportionalAmount,
  round3,
  transportForPayer,
} from '../helpers';
import {
  MonthDataBlock,
  ReportCompanyRef,
  ReportPaymentRef,
  ReportTypeEnum,
  Type0Report,
  Type0Row,
  Type0Totals,
} from '../types/month-report.types';

function lineSum(
  lines: Array<{ qty?: number; price?: number }> | undefined,
): number {
  return (lines ?? []).reduce(
    (acc, line) => acc + (Number(line.qty) || 0) * (Number(line.price) || 0),
    0,
  );
}

function activePayments(invoice: Invoice): {
  payments: ReportPaymentRef[];
  sum: number;
} {
  let sum = 0;
  const payments = (invoice.paymentLines ?? [])
    .filter((pl) => pl.payment?.status === true)
    .map((pl) => {
      const amount = Number(pl.amount) || 0;
      sum += amount;
      return {
        id: pl.payment.id,
        date: pl.payment.expectedDate ?? null,
        sum: amount,
      };
    });
  return { payments, sum };
}

function commissionPayments(invoice: Invoice): {
  commission: Type0Row['commission'];
  documentSum: number;
  leftSum: number;
  paySum: number;
  payments: ReportPaymentRef[];
  /** Snapshot total uses rate * outSum / 100, not document_sum. */
  rateBasedOnOut: (outSum: number) => number;
} {
  const commissions = (invoice.commissionInvoices ?? []).filter(
    (c) => c.status === true,
  );
  if (!commissions.length) {
    return {
      commission: null,
      documentSum: 0,
      leftSum: 0,
      paySum: 0,
      payments: [],
      rateBasedOnOut: () => 0,
    };
  }

  let documentSum = 0;
  let leftSum = 0;
  let paySum = 0;
  const payments: ReportPaymentRef[] = [];
  let last: Type0Row['commission'] = null;
  let rateTotalFactor = 0;

  for (const com of commissions) {
    last = {
      id: com.id,
      documentSum: Number(com.documentSum) || 0,
      rate: Number(com.rate) || 0,
    };
    documentSum += Number(com.documentSum) || 0;
    leftSum += Number(com.paymentBalance) || 0;
    rateTotalFactor += Number(com.rate) || 0;

    for (const payment of com.commissionPayments ?? []) {
      if (!payment.status) {
        continue;
      }
      for (const line of payment.commissionPaymentLines ?? []) {
        // Multi-line commission payments may reference other invoices (#11).
        if (
          line.commissionInvoiceId != null &&
          line.commissionInvoiceId !== com.id
        ) {
          continue;
        }
        const amount = Number(line.amount) || 0;
        paySum += amount;
        payments.push({
          id: payment.id,
          date: payment.expectedDate ?? null,
          sum: amount,
        });
      }
    }
  }

  return {
    commission: last,
    documentSum,
    leftSum,
    paySum,
    payments,
    rateBasedOnOut: (outSum: number) =>
      round3((rateTotalFactor * outSum) / 100),
  };
}

function buildNonSeparatedRow(
  inInvoice: Invoice,
  children: Invoice[],
): { row: Type0Row; totalsDelta: Partial<Type0Totals> } {
  const inLines = inInvoice.invoiceLines ?? [];
  const inServiceSum = lineSum(inInvoice.invoiceServiceLines);
  const inGoodsSum = lineSum(inLines);
  const inInvoiceSum = inGoodsSum + inServiceSum;
  const qty = inLines.reduce((a, l) => a + (Number(l.qty) || 0), 0);

  const orderMap = new Map<number, string>();
  for (const line of inLines) {
    if (line.order) {
      orderMap.set(line.order.id, line.order.orderNumber);
    }
  }
  const orderIds = [...orderMap.keys()];

  const inPay = activePayments(inInvoice);
  const inTransport = transportForPayer(
    Number(inInvoice.transportAmount) || 0,
    inInvoice.incoterms?.payerType,
    PayerType.BUYER,
  );

  let outInvoiceSum = 0;
  let outTransportSum = inTransport;
  let outPaymentSum = 0;
  const outPayments: ReportPaymentRef[] = [];
  const outInvoiceRefs: Type0Row['outInvoices'] = [];

  for (const out of children) {
    outTransportSum += transportForPayer(
      Number(out.transportAmount) || 0,
      out.incoterms?.payerType,
      PayerType.SELLER,
    );

    const orderLines = (out.invoiceLines ?? []).filter((l) =>
      orderIds.includes(l.orderId),
    );
    const matchedQty = orderLines.reduce((a, l) => a + (Number(l.qty) || 0), 0);
    const matchedSum = lineSum(orderLines);
    const allQty = (out.invoiceLines ?? []).reduce(
      (a, l) => a + (Number(l.qty) || 0),
      0,
    );
    const serviceSum = lineSum(out.invoiceServiceLines);
    let outSum = matchedSum;
    if (allQty) {
      outSum += (serviceSum * matchedQty) / allQty;
    }
    outInvoiceSum += outSum;

    const pay = activePayments(out);
    // Django adds full out payments when filtering by invoice, not proportion for non-sep.
    outPaymentSum += pay.sum;
    outPayments.push(...pay.payments);

    outInvoiceRefs.push({
      id: out.id,
      number: out.invoiceNumber,
      expectedDate: out.expectedDate ?? null,
      buyer: out.buyer ? { id: out.buyer.id, name: out.buyer.name } : null,
    });
  }

  const com = commissionPayments(inInvoice);
  // Snapshot commission uses rate * out / 100 (not document_sum).
  const comSumForTotal = com.rateBasedOnOut(outInvoiceSum);

  let delta = 0;
  const hasPostedOut = children.some((c) => c.status === true);
  if (hasPostedOut) {
    delta = outInvoiceSum - inInvoiceSum - inTransport;
    for (const out of children) {
      if (out.incoterms?.payerType === PayerType.SELLER) {
        // Django subtracts last out.transport when payer=sel inside the done branch.
        delta -= Number(out.transportAmount) || 0;
        break;
      }
    }
  }

  const row: Type0Row = {
    orderIds,
    orderNumbers: [...orderMap.values()],
    seller: inInvoice.seller
      ? { id: inInvoice.seller.id, name: inInvoice.seller.name }
      : null,
    inInvoice: {
      id: inInvoice.id,
      number: inInvoice.invoiceNumber,
      expectedDate: inInvoice.expectedDate ?? null,
      reportPeriod: inInvoice.reportPeriod ?? null,
    },
    inInvoiceSum: round3(inInvoiceSum),
    inPayments: inPay.payments,
    inPaymentSum: round3(inPay.sum),
    outInvoices: outInvoiceRefs,
    outInvoiceSum: round3(outInvoiceSum),
    outTransportSum: round3(outTransportSum),
    outPayments,
    outPaymentSum: round3(outPaymentSum),
    commission: com.commission,
    comSum: round3(com.documentSum),
    comPayments: com.payments,
    comPaymentsSum: round3(com.paySum),
    qty,
    delta: round3(delta),
  };

  return {
    row,
    totalsDelta: {
      qty,
      inSum: inInvoiceSum,
      inPaySum: inPay.sum,
      outSum: outInvoiceSum,
      outPaySum: outPaymentSum,
      outTransportSum,
      comSum: comSumForTotal,
      comPaySum: com.paySum,
      comLeftSum: com.leftSum,
      delta,
    },
  };
}

/**
 * Django separation: out lines by order among all posted invoices except in_invoice
 * (~Q(invoice=in_invoice)), not only children. out_total_sum for commission prop
 * still uses parent children (invoice__parent=in_invoice).
 */
function buildSeparatedRows(
  inInvoice: Invoice,
  children: Invoice[],
  orderOutInvoices: Invoice[],
): { rows: Type0Row[]; totalsDelta: Partial<Type0Totals> } {
  const inLines = inInvoice.invoiceLines ?? [];
  const serviceTotal = lineSum(inInvoice.invoiceServiceLines);
  const goodsQty = inLines.reduce((a, l) => a + (Number(l.qty) || 0), 0) || 1;
  const servicePrice = serviceTotal / goodsQty;
  const outerInvoiceTotalSum = lineSum(inLines) + serviceTotal;
  const inTransportPrice =
    inInvoice.incoterms?.payerType === PayerType.BUYER
      ? (Number(inInvoice.transportAmount) || 0) / goodsQty
      : 0;

  const orderIds = [
    ...new Set(inLines.map((l) => l.orderId).filter(Boolean)),
  ];

  const outTotalSum =
    children.reduce(
      (acc, out) =>
        acc + lineSum(out.invoiceLines) + lineSum(out.invoiceServiceLines),
      0,
    ) || 1;

  const rows: Type0Row[] = [];
  const totals: Partial<Type0Totals> = {
    qty: 0,
    inSum: 0,
    inPaySum: 0,
    outSum: 0,
    outPaySum: 0,
    outTransportSum: 0,
    comSum: 0,
    comPaySum: 0,
    comLeftSum: 0,
    delta: 0,
  };

  for (const orderId of orderIds) {
    const orderLines = inLines.filter((l) => l.orderId === orderId);
    if (!orderLines.length) {
      continue;
    }
    const order = orderLines[0].order;
    const orderQty = orderLines.reduce((a, l) => a + (Number(l.qty) || 0), 0);
    const inInvoiceSum = round3(
      orderLines.reduce(
        (a, l) =>
          a + (Number(l.qty) || 0) * ((Number(l.price) || 0) + servicePrice),
        0,
      ),
    );
    const inTransportSum = orderQty * inTransportPrice;

    let outInvoiceSum = 0;
    let outTransportSum = 0;
    let outPaymentSum = 0;
    const outPayments: ReportPaymentRef[] = [];
    const relatedOuts: Invoice[] = [];

    const candidates = orderOutInvoices.filter(
      (out) =>
        out.id !== inInvoice.id &&
        (out.invoiceLines ?? []).some((l) => l.orderId === orderId),
    );

    for (const out of candidates) {
      const outLinesForOrder = (out.invoiceLines ?? []).filter(
        (l) => l.orderId === orderId,
      );
      if (!outLinesForOrder.length) {
        continue;
      }
      relatedOuts.push(out);
      const outGoodsQty =
        (out.invoiceLines ?? []).reduce((a, l) => a + (Number(l.qty) || 0), 0) ||
        1;
      const outServiceTotal = lineSum(out.invoiceServiceLines);
      const outServicePrice = outServiceTotal / outGoodsQty;

      for (const outLine of outLinesForOrder) {
        outInvoiceSum += round3(
          (Number(outLine.qty) || 0) *
            ((Number(outLine.price) || 0) + outServicePrice),
        );
        if (out.incoterms?.payerType === PayerType.SELLER) {
          outTransportSum +=
            ((Number(outLine.qty) || 0) * (Number(out.transportAmount) || 0)) /
            outGoodsQty;
        }
      }

      const outInvoiceTotalSum =
        lineSum(out.invoiceLines) + lineSum(out.invoiceServiceLines) || 1;
      for (const pl of out.paymentLines ?? []) {
        if (!pl.payment?.status) {
          continue;
        }
        const paySum = proportionalAmount(
          Number(pl.amount) || 0,
          outInvoiceSum,
          outInvoiceTotalSum,
        );
        outPaymentSum += paySum;
        outPayments.push({
          id: pl.payment.id,
          date: pl.payment.expectedDate ?? null,
          sum: paySum,
        });
      }
    }

    const inPayRaw = activePayments(inInvoice);
    const inPayments = inPayRaw.payments.map((p) => ({
      ...p,
      sum: proportionalAmount(p.sum, inInvoiceSum, outerInvoiceTotalSum || 1),
    }));
    const inPaymentSum = inPayments.reduce((a, p) => a + p.sum, 0);

    const com = commissionPayments(inInvoice);
    const prop = inInvoiceSum / (Number(inInvoice.documentSum) || 1);
    const comDisplay = round3(com.documentSum * prop);
    const comSumForTotal = com.rateBasedOnOut(outInvoiceSum);
    const comPayments = com.payments.map((p) => ({
      ...p,
      sum: proportionalAmount(p.sum, outInvoiceSum, outTotalSum),
    }));
    const comPaymentsSum = comPayments.reduce((a, p) => a + p.sum, 0);

    let delta = 0;
    if (relatedOuts.some((c) => c.status)) {
      delta = outInvoiceSum - inInvoiceSum;
      const selOut = relatedOuts.find(
        (o) => o.incoterms?.payerType === PayerType.SELLER,
      );
      if (selOut) {
        delta -= Number(selOut.transportAmount) || 0;
      }
    }

    const transportTotal = outTransportSum + inTransportSum;
    rows.push({
      orderIds: [orderId],
      orderNumbers: order ? [order.orderNumber] : [],
      seller: order?.seller
        ? { id: order.seller.id, name: order.seller.name }
        : inInvoice.seller
          ? { id: inInvoice.seller.id, name: inInvoice.seller.name }
          : null,
      inInvoice: {
        id: inInvoice.id,
        number: inInvoice.invoiceNumber,
        expectedDate: inInvoice.expectedDate ?? null,
        reportPeriod: inInvoice.reportPeriod ?? null,
      },
      inInvoiceSum,
      inPayments,
      inPaymentSum: round3(inPaymentSum),
      outInvoices: relatedOuts.map((out) => ({
        id: out.id,
        number: out.invoiceNumber,
        expectedDate: out.expectedDate ?? null,
        buyer: out.buyer ? { id: out.buyer.id, name: out.buyer.name } : null,
      })),
      outInvoiceSum: round3(outInvoiceSum),
      outTransportSum: round3(transportTotal),
      outPayments,
      outPaymentSum: round3(outPaymentSum),
      commission: com.commission,
      comSum: comDisplay,
      comPayments,
      comPaymentsSum: round3(comPaymentsSum),
      qty: orderQty,
      delta: round3(delta),
    });

    totals.qty += orderQty;
    totals.inSum += inInvoiceSum;
    totals.inPaySum += inPaymentSum;
    totals.outSum += outInvoiceSum;
    totals.outPaySum += outPaymentSum;
    totals.outTransportSum += transportTotal;
    totals.comSum += comSumForTotal;
    totals.comPaySum += comPaymentsSum;
    totals.comLeftSum += com.leftSum * prop;
    totals.delta += delta;
  }

  return { rows, totalsDelta: totals };
}

export function buildReportType0(params: {
  company: ReportCompanyRef;
  date: string;
  process: number | null;
  incomeInvoices: Invoice[];
  childInvoicesByParentId: Map<number, Invoice[]>;
  /** Posted invoices linked by order (Django separation ~Q(invoice=in)). */
  orderOutInvoices: Invoice[];
  monthData: MonthDataBlock;
}): Type0Report {
  const lines: Type0Row[] = [];
  const totals: Type0Totals = {
    qty: 0,
    inSum: 0,
    inPaySum: 0,
    outSum: 0,
    outPaySum: 0,
    outTransportSum: 0,
    comSum: 0,
    comPaySum: 0,
    comLeftSum: 0,
    delta: 0,
  };

  const addTotals = (delta: Partial<Type0Totals>) => {
    for (const key of Object.keys(totals) as Array<keyof Type0Totals>) {
      totals[key] += Number(delta[key]) || 0;
    }
  };

  for (const inInvoice of params.incomeInvoices) {
    const children = params.childInvoicesByParentId.get(inInvoice.id) ?? [];
    if (inInvoice.separation) {
      const built = buildSeparatedRows(
        inInvoice,
        children,
        params.orderOutInvoices,
      );
      lines.push(...built.rows);
      addTotals(built.totalsDelta);
    } else {
      const built = buildNonSeparatedRow(inInvoice, children);
      lines.push(built.row);
      addTotals(built.totalsDelta);
    }
  }

  return {
    reportType: ReportTypeEnum.TYPE_0,
    company: params.company,
    date: params.date,
    process: params.process,
    monthData: params.monthData,
    lines,
    totals: {
      qty: totals.qty,
      inSum: round3(totals.inSum),
      inPaySum: round3(totals.inPaySum),
      outSum: round3(totals.outSum),
      outPaySum: round3(totals.outPaySum),
      outTransportSum: round3(totals.outTransportSum),
      comSum: round3(totals.comSum),
      comPaySum: round3(totals.comPaySum),
      comLeftSum: round3(totals.comLeftSum),
      delta: round3(totals.delta),
    },
  };
}

/** Pure helper for unit tests: commission snapshot value from rate × out. */
export function commissionSnapshotFromRate(
  rate: number,
  outInvoiceSum: number,
): number {
  return round3((rate * outInvoiceSum) / 100);
}
