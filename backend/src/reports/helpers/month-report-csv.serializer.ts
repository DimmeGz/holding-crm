import { BadRequestException } from '@nestjs/common';

import {
  MonthReportResponse,
  ReportTypeEnum,
  Type0Report,
  Type1Report,
  Type3Report,
} from '../types/month-report.types';

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function row(cells: unknown[]): string {
  return cells.map(csvEscape).join(',');
}

function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return '';
  }
  const d = typeof value === 'string' ? value : value.toISOString();
  return d.slice(0, 10);
}

function joinPayments(
  payments: Array<{ date: string | Date | null; sum: number }>,
): string {
  return payments
    .map((p) => `${formatDate(p.date)}: ${p.sum}`)
    .join(' | ');
}

function serializeType0(report: Type0Report): string[] {
  const lines: string[] = [];
  lines.push(
    row([
      '',
      '',
      '',
      '',
      'вхідні',
      'вхідні',
      'вхідні',
      'вхідні',
      'вхідні',
      'вхідні',
      'вихідні',
      'вихідні',
      'вихідні',
      'вихідні',
      'вихідні',
      'вихідні',
      'вихідні',
      '',
      'комісія',
      'комісія',
      'комісія',
      'комісія',
      '',
    ]),
  );
  lines.push(
    row([
      'Замовлення',
      'Постачальник',
      'Кількість',
      'Дата, інвойс',
      'Інвойс',
      'Дата оплати',
      'Сума',
      'Оплати',
      'Залишок оплати',
      'Дата, інвойс',
      'Покупець',
      'Інвойс',
      'Сума',
      'Транспорт',
      'Оплати',
      'Залишок оплати',
      'Дельта',
      'Комісія',
      'Сума',
      'Оплати',
      'Залишок',
      'Дохід',
    ]),
  );

  for (const item of report.lines) {
    const inLeft = item.inInvoiceSum - item.inPaymentSum;
    const outLeft = item.outInvoiceSum - item.outPaymentSum;
    const comLeft = item.comSum - item.comPaymentsSum;
    const income = item.delta - item.comSum;
    lines.push(
      row([
        item.orderNumbers.join(' | '),
        item.seller?.name ?? '',
        item.qty,
        formatDate(item.inInvoice.expectedDate),
        item.inInvoice.number,
        joinPayments(item.inPayments),
        item.inInvoiceSum,
        item.inPaymentSum,
        inLeft,
        item.outInvoices
          .map((o) => formatDate(o.expectedDate))
          .join(' | '),
        item.outInvoices
          .map((o) => o.buyer?.name ?? '')
          .join(' | '),
        item.outInvoices.map((o) => o.number).join(' | '),
        item.outInvoiceSum,
        item.outTransportSum,
        item.outPaymentSum,
        outLeft,
        item.delta,
        item.commission?.rate ?? '',
        item.comSum,
        item.comPaymentsSum,
        comLeft,
        income,
      ]),
    );
  }

  lines.push(
    row([
      '',
      '',
      report.totals.qty,
      '',
      '',
      '',
      report.totals.inSum,
      report.totals.inPaySum,
      '',
      '',
      '',
      '',
      report.totals.outSum,
      report.totals.outTransportSum,
      report.totals.outPaySum,
      '',
      report.totals.delta,
      '',
      report.totals.comSum,
      report.totals.comPaySum,
      report.totals.comLeftSum,
      '',
    ]),
  );

  return lines;
}

function serializeType1(report: Type1Report): string[] {
  const lines: string[] = [];
  lines.push(row(['НАДХОДЖЕННЯ']));
  lines.push(
    row([
      'Дата',
      'Інвойс',
      'Контрагент',
      'Сума',
      'Собівартість',
      'ПДВ',
      'Транспорт',
      'Оплати',
      'Сума оплат',
    ]),
  );
  for (const item of report.incomes) {
    lines.push(
      row([
        formatDate(item.invoice.expectedDate),
        item.invoice.number,
        item.invoice.partner?.name ?? '',
        item.sum,
        item.cost,
        item.vat,
        item.transport,
        joinPayments(item.payments),
        item.paymentSum,
      ]),
    );
  }
  lines.push(
    row([
      'Разом',
      '',
      '',
      report.incomeTotal.sum,
      report.incomeTotal.cost,
      report.incomeTotal.vat,
      report.incomeTotal.transport,
      '',
      report.incomeTotal.pay,
    ]),
  );

  lines.push(row([]));
  lines.push(row(['ВІДВАНТАЖЕННЯ']));
  lines.push(
    row([
      'Дата',
      'Інвойс',
      'Контрагент',
      'Сума',
      'Собівартість',
      'ПДВ',
      'Транспорт',
      'Оплати',
      'Сума оплат',
    ]),
  );
  for (const item of report.outgoings) {
    lines.push(
      row([
        formatDate(item.invoice.expectedDate),
        item.invoice.number,
        item.invoice.partner?.name ?? '',
        item.sum,
        item.cost,
        item.vat,
        item.transport,
        joinPayments(item.payments),
        item.paymentSum,
      ]),
    );
  }
  lines.push(
    row([
      'Разом',
      '',
      '',
      report.outgoingTotal.sum,
      report.outgoingTotal.cost,
      report.outgoingTotal.vat,
      report.outgoingTotal.transport,
      '',
      report.outgoingTotal.pay,
    ]),
  );

  return lines;
}

function serializeType3Lines(
  title: string,
  items: Type3Report['inLines'],
): string[] {
  const lines: string[] = [];
  lines.push(row([title]));
  lines.push(
    row([
      'Дата',
      'Інвойс',
      'Контрагент',
      'Продукт/Послуга',
      'Кількість',
      'Ціна',
      'Собівартість',
      'Транспорт',
      'Оплати',
      'Сума оплат',
    ]),
  );
  for (const item of items) {
    lines.push(
      row([
        formatDate(item.expectedDate),
        item.invoiceNumber,
        item.partner?.name ?? '',
        item.productName ?? item.serviceName ?? '',
        item.qty,
        item.price,
        item.cost,
        item.transport,
        joinPayments(item.payments),
        item.paySum,
      ]),
    );
  }
  return lines;
}

function serializeType3(report: Type3Report): string[] {
  return [
    ...serializeType3Lines('НАДХОДЖЕННЯ (товар)', report.inLines),
    row([]),
    ...serializeType3Lines('НАДХОДЖЕННЯ (послуги)', report.inServiceLines),
    row([]),
    ...serializeType3Lines('ВІДВАНТАЖЕННЯ (товар)', report.outLines),
    row([]),
    ...serializeType3Lines('ВІДВАНТАЖЕННЯ (послуги)', report.outServiceLines),
    row([]),
    ...serializeType3Lines('ДУБЛІКАТИ', report.doubleServiceLines),
    row([]),
    row([
      'Разом in sum',
      report.inSum,
      'in cost',
      report.inCost,
      'in pay',
      report.inPaySum,
      'out sum',
      report.outSum,
      'out cost',
      report.outCost,
      'out pay',
      report.outPaySum,
    ]),
  ];
}

export function serializeMonthReportCsv(report: MonthReportResponse): string {
  let bodyLines: string[];

  switch (report.reportType) {
    case ReportTypeEnum.TYPE_0:
      bodyLines = serializeType0(report);
      break;
    case ReportTypeEnum.TYPE_1:
      bodyLines = serializeType1(report);
      break;
    case ReportTypeEnum.TYPE_3:
      bodyLines = serializeType3(report);
      break;
    case ReportTypeEnum.TYPE_2:
    default:
      throw new BadRequestException(
        'CSV export is not supported for this report type',
      );
  }

  const bom = '\uFEFF';
  return bom + bodyLines.join('\n') + '\n';
}

export function buildCsvFilename(
  companyName: string,
  date: string,
): string {
  const safeName = companyName.replace(/[^\w\-]+/g, '_');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${safeName}__${date}__${stamp}.csv`;
}
