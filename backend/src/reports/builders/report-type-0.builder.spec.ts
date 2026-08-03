import { Invoice } from '../../documents/invoices/entities';
import { PayerType } from '../../libs/enums';
import { buildReportType0, commissionSnapshotFromRate } from './report-type-0.builder';
import { emptySnapshot } from '../helpers';
import { ReportTypeEnum } from '../types/month-report.types';

function makeInvoice(partial: Partial<Invoice> & { id: number }): Invoice {
  return partial as Invoice;
}

describe('buildReportType0', () => {
  it('uses rate * out / 100 for totals.commission (not document_sum)', () => {
    expect(commissionSnapshotFromRate(5, 400)).toBe(20);
  });

  it('separation finds outs by order even without parent_id', () => {
    const inInvoice = makeInvoice({
      id: 1,
      separation: true,
      invoiceNumber: 'IN-1',
      documentSum: 100,
      transportAmount: 0,
      status: true,
      seller: { id: 10, name: 'Seller' } as Invoice['seller'],
      incoterms: { payerType: PayerType.BUYER } as Invoice['incoterms'],
      invoiceLines: [
        {
          id: 11,
          qty: 10,
          price: 10,
          orderId: 77,
          order: {
            id: 77,
            orderNumber: 'O-77',
            seller: { id: 10, name: 'Seller' },
          },
        },
      ] as Invoice['invoiceLines'],
      invoiceServiceLines: [],
      paymentLines: [],
      commissionInvoices: [],
    });

    // Sell invoice linked by order only (no parent) — Django path.
    const orderOut = makeInvoice({
      id: 2,
      parentId: null,
      invoiceNumber: 'OUT-2',
      transportAmount: 0,
      status: true,
      buyer: { id: 20, name: 'Buyer' } as Invoice['buyer'],
      incoterms: { payerType: PayerType.SELLER } as Invoice['incoterms'],
      invoiceLines: [
        {
          id: 21,
          qty: 10,
          price: 15,
          orderId: 77,
          order: { id: 77, orderNumber: 'O-77' },
        },
      ] as Invoice['invoiceLines'],
      invoiceServiceLines: [],
      paymentLines: [],
    });

    const report = buildReportType0({
      company: { id: 1, name: 'Co', reportType: ReportTypeEnum.TYPE_0 },
      date: '2026-08',
      process: null,
      incomeInvoices: [inInvoice],
      childInvoicesByParentId: new Map(),
      orderOutInvoices: [orderOut],
      monthData: {
        saved: null,
        snapshot: emptySnapshot(),
        countVatReturn: null,
      },
    });

    expect(report.lines).toHaveLength(1);
    expect(report.lines[0].outInvoices.map((o) => o.id)).toEqual([2]);
    expect(report.lines[0].outInvoiceSum).toBe(150);
    expect(report.totals.outSum).toBe(150);
  });
});
