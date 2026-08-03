import { Invoice } from '../../documents/invoices/entities';
import { PayerType } from '../../libs/enums';
import {
  isQuarterEndMonth,
  proportionalAmount,
  round3,
  safeProportion,
} from '../helpers';
import {
  MonthDataBlock,
  ReportCompanyRef,
  ReportTypeEnum,
  Type3LineRow,
  Type3QuarterGroup,
  Type3Report,
} from '../types/month-report.types';

function lineGoodsSum(invoice: Invoice): number {
  return (invoice.invoiceLines ?? []).reduce(
    (acc, line) => acc + (Number(line.qty) || 0) * (Number(line.price) || 0),
    0,
  );
}

function mapProductLines(
  invoices: Invoice[],
  transportPayer: PayerType,
  partnerKey: 'seller' | 'buyer',
): {
  rows: Type3LineRow[];
  sum: number;
  cost: number;
  vatSum: number;
  paySum: number;
  qty: number;
  transport: number;
} {
  let sum = 0;
  let cost = 0;
  let vatSum = 0;
  let paySum = 0;
  let qty = 0;
  let transport = 0;
  const rows: Type3LineRow[] = [];

  for (const invoice of invoices) {
    const invoiceSum = lineGoodsSum(invoice);
    const documentSum = Number(invoice.documentSum) || 0;
    const partner = invoice[partnerKey];

    for (const line of invoice.invoiceLines ?? []) {
      const lineAmount = (Number(line.qty) || 0) * (Number(line.price) || 0);
      const lineCost = (Number(line.qty) || 0) * (Number(line.cost) || 0);
      sum += lineAmount;
      cost += lineCost;
      vatSum += (lineAmount * (Number(invoice.vat) || 0)) / 100;
      qty += Number(line.qty) || 0;

      const transProp = safeProportion(lineAmount, invoiceSum);
      let lineTransport = 0;
      if (invoice.incoterms?.payerType === transportPayer) {
        lineTransport =
          (Number(invoice.transportAmount) || 0) * transProp;
        transport += lineTransport;
      }

      const payments = (invoice.paymentLines ?? [])
        .filter((pl) => pl.payment?.status === true)
        .map((pl) => {
          const amount = proportionalAmount(
            Number(pl.amount) || 0,
            lineAmount,
            documentSum || 1,
          );
          paySum += amount;
          return {
            id: pl.payment.id,
            date: pl.payment.expectedDate ?? null,
            sum: amount,
          };
        });

      const linePaySum = payments.reduce((a, p) => a + p.sum, 0);

      rows.push({
        lineId: line.id,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        expectedDate: invoice.expectedDate ?? null,
        reportPeriod: invoice.reportPeriod ?? null,
        partner: partner ? { id: partner.id, name: partner.name } : null,
        productName: line.product?.name ?? null,
        serviceName: null,
        qty: Number(line.qty) || 0,
        price: Number(line.price) || 0,
        cost: Number(line.cost) || 0,
        transport: round3(lineTransport),
        paySum: round3(linePaySum),
        payments,
        isService: false,
        isDouble: false,
      });
    }
  }

  return {
    rows,
    sum: round3(sum),
    cost: round3(cost),
    vatSum: round3(vatSum),
    paySum: round3(paySum),
    qty,
    transport: round3(transport),
  };
}

function mapServiceLines(
  invoices: Invoice[],
  partnerKey: 'seller' | 'buyer',
  asDouble = false,
): {
  rows: Type3LineRow[];
  sum: number;
  vatSum: number;
  paySum: number;
} {
  let sum = 0;
  let vatSum = 0;
  let paySum = 0;
  const rows: Type3LineRow[] = [];

  for (const invoice of invoices) {
    const documentSum = Number(invoice.documentSum) || 0;
    const partner = invoice[partnerKey];

    for (const line of invoice.invoiceServiceLines ?? []) {
      const price = asDouble
        ? -(Number(line.price) || 0)
        : Number(line.price) || 0;
      const lineAmount =
        (Number(line.qty) || 0) * Math.abs(Number(line.price) || 0);

      if (!asDouble) {
        sum += lineAmount;
        if (invoice.vat) {
          vatSum += (lineAmount * (Number(invoice.vat) || 0)) / 100;
        }
      } else {
        sum += (Number(line.qty) || 0) * (Number(line.price) || 0);
      }

      const payments = asDouble
        ? []
        : (invoice.paymentLines ?? [])
            .filter((pl) => pl.payment?.status === true)
            .map((pl) => {
              const amount = proportionalAmount(
                Number(pl.amount) || 0,
                lineAmount,
                documentSum || 1,
              );
              paySum += amount;
              return {
                id: pl.payment.id,
                date: pl.payment.expectedDate ?? null,
                sum: amount,
              };
            });

      rows.push({
        lineId: line.id,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        expectedDate: invoice.expectedDate ?? null,
        reportPeriod: invoice.reportPeriod ?? null,
        partner: partner ? { id: partner.id, name: partner.name } : null,
        productName: null,
        serviceName: line.service?.name ?? null,
        qty: Number(line.qty) || 0,
        price,
        cost: 0,
        transport: 0,
        paySum: round3(payments.reduce((a, p) => a + p.sum, 0)),
        payments,
        isService: true,
        isDouble: asDouble,
      });
    }
  }

  return {
    rows,
    sum: round3(sum),
    vatSum: round3(vatSum),
    paySum: round3(paySum),
  };
}

function buildQuarterBlock(
  outgoings: Invoice[],
  date: string,
): Type3Report['quarter'] {
  if (!isQuarterEndMonth(date)) {
    return null;
  }

  const groups: Record<
    'CLEARON' | 'FLOTRON' | 'FERROFORM',
    Map<string, Record<string, number>>
  > = {
    CLEARON: new Map(),
    FLOTRON: new Map(),
    FERROFORM: new Map(),
  };
  const companies = {
    CLEARON: new Set<string>(),
    FLOTRON: new Set<string>(),
    FERROFORM: new Set<string>(),
  };

  for (const invoice of outgoings) {
    const processNames = (invoice.technicalProcesses ?? []).map((p) => p.name);
    if (processNames.includes('all_in')) {
      continue;
    }

    for (const line of invoice.invoiceLines ?? []) {
      const productName = line.product?.name ?? '';
      const buyerName = invoice.buyer?.name ?? '';
      let group: keyof typeof groups | null = null;

      if (productName.startsWith('CLEARON')) {
        group = 'CLEARON';
      } else if (productName.startsWith('FLOTRON')) {
        group = 'FLOTRON';
      } else if (
        productName.startsWith('FERROFORM') ||
        productName.startsWith('LENACRYL')
      ) {
        group = 'FERROFORM';
      }

      if (!group) {
        continue;
      }

      // Without users_permission (auth out of scope): include all groups with data.
      const productMap = groups[group];
      const buyers = productMap.get(productName) ?? {};
      buyers[buyerName] = (buyers[buyerName] ?? 0) + (Number(line.qty) || 0);
      productMap.set(productName, buyers);
      companies[group].add(buyerName);
    }
  }

  const toGroups = (
    map: Map<string, Record<string, number>>,
  ): Type3QuarterGroup[] =>
    [...map.entries()].map(([productName, buyers]) => ({
      productName,
      buyers,
    }));

  return {
    CLEARON: toGroups(groups.CLEARON),
    FLOTRON: toGroups(groups.FLOTRON),
    FERROFORM: toGroups(groups.FERROFORM),
    clearonCompanies: [...companies.CLEARON].sort(),
    flotronCompanies: [...companies.FLOTRON].sort(),
    ferroformCompanies: [...companies.FERROFORM].sort(),
  };
}

export function buildReportType3(params: {
  company: ReportCompanyRef;
  date: string;
  process: number | null;
  incomes: Invoice[];
  outgoings: Invoice[];
  doubles: Invoice[];
  quarterOutgoings: Invoice[];
  monthData: MonthDataBlock;
}): Type3Report {
  const inGoods = mapProductLines(params.incomes, PayerType.BUYER, 'seller');
  const outGoods = mapProductLines(params.outgoings, PayerType.SELLER, 'buyer');
  const inServices = mapServiceLines(params.incomes, 'seller');
  const outServices = mapServiceLines(params.outgoings, 'buyer');
  const doubles = mapServiceLines(params.doubles, 'seller', true);

  return {
    reportType: ReportTypeEnum.TYPE_3,
    company: params.company,
    date: params.date,
    process: params.process,
    monthData: params.monthData,
    inLines: inGoods.rows,
    outLines: outGoods.rows,
    inServiceLines: inServices.rows,
    outServiceLines: outServices.rows,
    doubleServiceLines: doubles.rows,
    inSum: round3(inGoods.sum + inServices.sum),
    inCost: inGoods.cost,
    inVatSum: round3(inGoods.vatSum + inServices.vatSum),
    inPaySum: round3(inGoods.paySum + inServices.paySum),
    inTotalQty: inGoods.qty,
    inTotalTransport: inGoods.transport,
    outSum: round3(outGoods.sum + outServices.sum),
    outCost: outGoods.cost,
    outVatSum: round3(outGoods.vatSum + outServices.vatSum),
    outPaySum: round3(outGoods.paySum + outServices.paySum),
    outTotalQty: outGoods.qty,
    outTotalTransport: outGoods.transport,
    doubledSum: doubles.sum,
    quarter: buildQuarterBlock(params.quarterOutgoings, params.date),
  };
}
