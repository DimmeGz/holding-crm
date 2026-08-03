import dayjs from 'dayjs';
import type {
  CompanyAccountRow,
  CompanyInvoiceRef,
  CompanyListItem,
} from '@/types/companies/companies.types';

export type CompanyInvoiceGroup = {
  counterpartyId: number;
  counterpartyName: string;
  invoices: CompanyInvoiceRef[];
  total: number;
};

export function flattenCompanyAccounts(
  companies: CompanyListItem[],
): CompanyAccountRow[] {
  const rows: CompanyAccountRow[] = [];

  for (const company of companies) {
    for (const account of company.accounts ?? []) {
      const balance = Number(account.balance) || 0;
      const wait = Number(account.wait) || 0;
      const debt = Number(account.debt) || 0;

      if (balance === 0 && wait === 0 && debt === 0) {
        continue;
      }

      rows.push({
        accountId: account.id,
        companyId: company.id,
        companyName: company.name,
        currencyId: account.currency?.id ?? 0,
        currencyName: account.currency?.name ?? '',
        balance,
        wait,
        debt,
      });
    }
  }

  return rows.sort(
    (a, b) =>
      a.companyName.localeCompare(b.companyName) ||
      a.currencyName.localeCompare(b.currencyName),
  );
}

export function groupInvoicesByCounterparty(
  invoices: CompanyInvoiceRef[],
  side: 'waiting' | 'debt',
): CompanyInvoiceGroup[] {
  const groups = new Map<number, CompanyInvoiceGroup>();

  for (const invoice of invoices) {
    const counterpartyId =
      side === 'waiting' ? invoice.buyerId : invoice.sellerId;
    const counterpartyName =
      side === 'waiting'
        ? (invoice.buyer?.name ?? String(counterpartyId))
        : (invoice.seller?.name ?? String(counterpartyId));

    const existing = groups.get(counterpartyId);
    if (existing) {
      existing.invoices.push(invoice);
      existing.total += Number(invoice.paymentBalance) || 0;
    } else {
      groups.set(counterpartyId, {
        counterpartyId,
        counterpartyName,
        invoices: [invoice],
        total: Number(invoice.paymentBalance) || 0,
      });
    }
  }

  return Array.from(groups.values()).sort((a, b) =>
    a.counterpartyName.localeCompare(b.counterpartyName),
  );
}

export function getInvoiceDueDate(invoice: CompanyInvoiceRef): dayjs.Dayjs {
  return dayjs(invoice.expectedDate).add(invoice.paymentDelay || 0, 'day');
}

export function isInvoiceOverdue(invoice: CompanyInvoiceRef): boolean {
  if (!invoice.expectedDate) {
    return false;
  }

  return getInvoiceDueDate(invoice).isBefore(dayjs(), 'day');
}

export function validatePaymentInvoiceSelection(
  invoices: CompanyInvoiceRef[],
): boolean {
  if (invoices.length === 0) {
    return false;
  }

  const first = invoices[0];
  return invoices.every(
    (invoice) =>
      invoice.sellerId === first.sellerId &&
      invoice.buyerId === first.buyerId &&
      invoice.currencyId === first.currencyId,
  );
}
