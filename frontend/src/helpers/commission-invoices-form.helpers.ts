import { findRecordIdByName } from '@/helpers/select.helpers';
import type {
  CommissionInvoiceFormValues,
  CreateCommissionInvoicePayload,
  GetCommissionInvoiceDto,
  UpdateCommissionInvoicePayload,
} from '@/types/documents/commission-invoices.types';
import type { Invoice } from '@/types/documents/invoices.types';

export function createEmptyCommissionInvoiceFormValues(
  defaultCurrencyId?: number,
): CommissionInvoiceFormValues {
  return {
    sellerId: null,
    buyerId: null,
    invoiceId: null,
    currencyId: defaultCurrencyId ? String(defaultCurrencyId) : null,
    creationDate: new Date(),
    rate: 0,
    comment: '',
  };
}

export function commissionInvoiceToFormValues(
  commission: GetCommissionInvoiceDto,
): CommissionInvoiceFormValues {
  return {
    sellerId: String(commission.sellerId),
    buyerId: String(commission.buyerId),
    invoiceId: String(commission.invoice.id),
    currencyId: String(commission.currencyId),
    creationDate: commission.creationDate
      ? new Date(commission.creationDate)
      : null,
    rate: Number(commission.rate) || 0,
    comment: commission.comment ?? '',
  };
}

export function prefillFromInvoice(
  invoice: Invoice,
  defaultCurrencyId?: number,
): CommissionInvoiceFormValues {
  return {
    sellerId: null,
    buyerId: String(invoice.buyerId),
    invoiceId: String(invoice.id),
    currencyId: String(invoice.currencyId ?? defaultCurrencyId ?? ''),
    creationDate: new Date(),
    rate: 0,
    comment: '',
  };
}

export function formValuesToCreatePayload(
  values: CommissionInvoiceFormValues,
): CreateCommissionInvoicePayload {
  return {
    sellerId: Number(values.sellerId),
    buyerId: Number(values.buyerId),
    invoiceId: Number(values.invoiceId),
    currencyId: Number(values.currencyId),
    creationDate: values.creationDate ?? undefined,
    rate: Number(values.rate),
    comment: values.comment || undefined,
  };
}

export function formValuesToUpdatePayload(
  values: CommissionInvoiceFormValues,
): UpdateCommissionInvoicePayload {
  return {
    sellerId: Number(values.sellerId),
    currencyId: Number(values.currencyId),
    creationDate: values.creationDate ?? undefined,
    rate: Number(values.rate),
    comment: values.comment || undefined,
  };
}

export function getDefaultEurCurrencyId(
  currencies: Record<number, string>,
): number | undefined {
  return findRecordIdByName(currencies, 'EUR');
}

export function validateCommissionInvoiceForm(
  values: CommissionInvoiceFormValues,
): string | null {
  if (
    !values.sellerId ||
    !values.buyerId ||
    !values.invoiceId ||
    !values.currencyId
  ) {
    return 'required';
  }

  if (!values.rate || values.rate <= 0) {
    return 'rate';
  }

  return null;
}
