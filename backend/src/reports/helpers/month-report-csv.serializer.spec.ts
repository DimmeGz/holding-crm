import { BadRequestException } from '@nestjs/common';

import {
  buildCsvFilename,
  serializeMonthReportCsv,
} from './month-report-csv.serializer';
import { emptySnapshot } from './month-data-snapshot.helpers';
import {
  MonthReportResponse,
  ReportTypeEnum,
  Type0Report,
  Type2Report,
} from '../types/month-report.types';

const base = {
  company: { id: 1, name: 'Test Co', reportType: 0 },
  date: '2024-06',
  process: null,
  monthData: {
    saved: null,
    snapshot: emptySnapshot(),
    countVatReturn: null,
  },
};

describe('month-report-csv.serializer', () => {
  it('serializes type 0 with BOM and totals', () => {
    const report: Type0Report = {
      ...base,
      reportType: ReportTypeEnum.TYPE_0,
      lines: [
        {
          orderIds: [10],
          orderNumbers: ['ORD-1'],
          seller: { id: 2, name: 'Seller' },
          inInvoice: {
            id: 1,
            number: 'IN-1',
            expectedDate: '2024-06-01',
            reportPeriod: '2024-06-01',
          },
          inInvoiceSum: 100,
          inPayments: [{ id: 1, date: '2024-06-05', sum: 40 }],
          inPaymentSum: 40,
          outInvoices: [
            {
              id: 2,
              number: 'OUT-1',
              expectedDate: '2024-06-10',
              buyer: { id: 3, name: 'Buyer' },
            },
          ],
          outInvoiceSum: 150,
          outTransportSum: 10,
          outPayments: [],
          outPaymentSum: 0,
          commission: { id: 1, documentSum: 0, rate: 2 },
          comSum: 3,
          comPayments: [],
          comPaymentsSum: 0,
          qty: 5,
          delta: 40,
        },
      ],
      totals: {
        qty: 5,
        inSum: 100,
        inPaySum: 40,
        outSum: 150,
        outPaySum: 0,
        outTransportSum: 10,
        comSum: 3,
        comPaySum: 0,
        comLeftSum: 3,
        delta: 40,
      },
    };

    const csv = serializeMonthReportCsv(report);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('ORD-1');
    expect(csv).toContain('Seller');
    expect(csv).toContain('IN-1');
  });

  it('rejects type 2', () => {
    const report: Type2Report = {
      ...base,
      company: { ...base.company, reportType: 2 },
      reportType: ReportTypeEnum.TYPE_2,
      incomes: [],
      outgoings: [],
      inQty: 0,
      inSum: 0,
      outQty: 0,
      outSum: 0,
    };

    expect(() =>
      serializeMonthReportCsv(report as MonthReportResponse),
    ).toThrow(BadRequestException);
  });

  it('builds safe filename', () => {
    const name = buildCsvFilename('Acme / Co', '2024-06');
    expect(name).toMatch(/^Acme_Co__2024-06__.*\.csv$/);
  });
});
