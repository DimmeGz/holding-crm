import { Invoice } from '../../documents/invoices/entities';
import { PayerType } from '../../libs/enums';
import { round3, transportForPayer } from '../helpers';
import {
  Type1InvoiceRow,
  Type1Report,
  Type1SideTotals,
} from '../types/month-report.types';
import { ReportTypeEnum } from '../types/month-report.types';
import { MonthDataBlock, ReportCompanyRef } from '../types/month-report.types';

function mapSide(
  invoices: Invoice[],
  transportPayer: PayerType,
  partnerKey: 'seller' | 'buyer',
): { rows: Type1InvoiceRow[]; totals: Type1SideTotals } {
  const totals: Type1SideTotals = {
    qty: 0,
    sum: 0,
    cost: 0,
    vat: 0,
    transport: 0,
    pay: 0,
  };
  const rows: Type1InvoiceRow[] = [];

  for (const invoice of invoices) {
    const lines = (invoice.invoiceLines ?? []).map((line) => ({
      id: line.id,
      qty: Number(line.qty) || 0,
      price: Number(line.price) || 0,
      cost: Number(line.cost) || 0,
      product: line.product
        ? { id: line.product.id, name: line.product.name }
        : null,
    }));

    let cost = 0;
    for (const line of lines) {
      cost += line.qty * line.cost;
      totals.qty += line.qty;
    }

    const sum = Number(invoice.documentSum) || 0;
    const vat = round3((sum * (Number(invoice.vat) || 0)) / 100);
    const transport = transportForPayer(
      Number(invoice.transportAmount) || 0,
      invoice.incoterms?.payerType,
      transportPayer,
    );

    const activePaymentLines = (invoice.paymentLines ?? []).filter(
      (pl) => pl.payment?.status === true,
    );
    let paymentSum = 0;
    const payments = activePaymentLines.map((pl) => {
      const amount = Number(pl.amount) || 0;
      paymentSum += amount;
      return {
        id: pl.payment.id,
        date: pl.payment.expectedDate ?? null,
        sum: amount,
      };
    });

    totals.sum += sum;
    totals.cost += cost;
    totals.vat += vat;
    totals.transport += transport;
    totals.pay += paymentSum;

    const partner = invoice[partnerKey];
    rows.push({
      invoice: {
        id: invoice.id,
        number: invoice.invoiceNumber,
        expectedDate: invoice.expectedDate ?? null,
        reportPeriod: invoice.reportPeriod ?? null,
        vat: Number(invoice.vat) || 0,
        documentSum: sum,
        partner: partner ? { id: partner.id, name: partner.name } : null,
      },
      lines,
      sum,
      cost: round3(cost),
      vat,
      transport,
      paymentSum: round3(paymentSum),
      payments,
    });
  }

  return {
    rows,
    totals: {
      ...totals,
      sum: round3(totals.sum),
      cost: round3(totals.cost),
      vat: round3(totals.vat),
      transport: round3(totals.transport),
      pay: round3(totals.pay),
    },
  };
}

export function buildReportType1(params: {
  company: ReportCompanyRef;
  date: string;
  process: number | null;
  incomes: Invoice[];
  outgoings: Invoice[];
  monthData: MonthDataBlock;
}): Type1Report {
  const incomeSide = mapSide(params.incomes, PayerType.BUYER, 'seller');
  const outgoingSide = mapSide(params.outgoings, PayerType.SELLER, 'buyer');

  return {
    reportType: ReportTypeEnum.TYPE_1,
    company: params.company,
    date: params.date,
    process: params.process,
    monthData: params.monthData,
    incomes: incomeSide.rows,
    outgoings: outgoingSide.rows,
    incomeTotal: incomeSide.totals,
    outgoingTotal: outgoingSide.totals,
  };
}
