import { Invoice } from '../../documents/invoices/entities';
import { round3 } from '../helpers';
import {
  ReportCompanyRef,
  MonthDataBlock,
  ReportTypeEnum,
  Type2ProductRow,
  Type2Report,
} from '../types/month-report.types';

function aggregateByProduct(invoices: Invoice[]): {
  rows: Type2ProductRow[];
  qty: number;
  sum: number;
} {
  const map = new Map<number, Type2ProductRow>();
  let qty = 0;
  let sum = 0;

  for (const invoice of invoices) {
    for (const line of invoice.invoiceLines ?? []) {
      if (!line.product) {
        continue;
      }
      const lineSum = (Number(line.qty) || 0) * (Number(line.price) || 0);
      const existing = map.get(line.product.id);
      if (existing) {
        existing.qty += Number(line.qty) || 0;
        existing.sum = round3(existing.sum + lineSum);
      } else {
        map.set(line.product.id, {
          productId: line.product.id,
          productName: line.product.name,
          qty: Number(line.qty) || 0,
          sum: round3(lineSum),
        });
      }
      qty += Number(line.qty) || 0;
      sum += lineSum;
    }
  }

  return {
    rows: [...map.values()],
    qty,
    sum: round3(sum),
  };
}

export function buildReportType2(params: {
  company: ReportCompanyRef;
  date: string;
  incomes: Invoice[];
  outgoings: Invoice[];
  monthData: MonthDataBlock;
}): Type2Report {
  const income = aggregateByProduct(params.incomes);
  const outgoing = aggregateByProduct(params.outgoings);

  return {
    reportType: ReportTypeEnum.TYPE_2,
    company: params.company,
    date: params.date,
    process: null,
    monthData: params.monthData,
    incomes: income.rows,
    outgoings: outgoing.rows,
    inQty: income.qty,
    inSum: income.sum,
    outQty: outgoing.qty,
    outSum: outgoing.sum,
  };
}
