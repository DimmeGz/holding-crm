import { findRecordIdByName } from '@/helpers/select.helpers';
import type { Invoice } from '@/types/documents/invoices.types';
import type {
  CreatePaymentPayload,
  Payment,
  PaymentFormValues,
  UpdatePaymentPayload,
} from '@/types/documents/payments.types';

export function createEmptyPaymentFormValues(
  defaultCurrencyId?: number,
): PaymentFormValues {
  return {
    sellerId: null,
    buyerId: null,
    currencyId: defaultCurrencyId ? String(defaultCurrencyId) : null,
    expectedDate: new Date(),
    comment: '',
    paymentLines: [{ invoiceId: null, amount: 0 }],
  };
}

export function paymentToFormValues(payment: Payment): PaymentFormValues {
  return {
    sellerId: String(payment.sellerId),
    buyerId: String(payment.buyerId),
    currencyId: String(payment.currencyId),
    expectedDate: payment.expectedDate
      ? new Date(payment.expectedDate)
      : null,
    comment: payment.comment ?? '',
    paymentLines: (payment.paymentLines ?? []).map(line => ({
      id: line.id,
      invoiceId: String(line.invoice?.id ?? line.invoiceId),
      amount: Number(line.amount) || 0,
    })),
  };
}

export function prefillFromInvoices(
  invoices: Invoice[],
  defaultCurrencyId?: number,
): PaymentFormValues {
  const first = invoices[0];

  return {
    sellerId: first ? String(first.sellerId) : null,
    buyerId: first ? String(first.buyerId) : null,
    currencyId: first
      ? String(first.currencyId)
      : defaultCurrencyId
        ? String(defaultCurrencyId)
        : null,
    expectedDate: new Date(),
    comment: '',
    paymentLines: invoices.map(invoice => ({
      invoiceId: String(invoice.id),
      amount: Number(invoice.paymentBalance) || 0,
    })),
  };
}

export function formValuesToCreatePayload(
  values: PaymentFormValues,
): CreatePaymentPayload {
  return {
    sellerId: Number(values.sellerId),
    buyerId: Number(values.buyerId),
    currencyId: Number(values.currencyId),
    expectedDate: values.expectedDate!,
    comment: values.comment || undefined,
    paymentLines: values.paymentLines.map(line => ({
      invoiceId: Number(line.invoiceId),
      amount: Number(line.amount),
    })),
  };
}

export function formValuesToUpdatePayload(
  values: PaymentFormValues,
): UpdatePaymentPayload {
  return {
    sellerId: Number(values.sellerId),
    buyerId: Number(values.buyerId),
    currencyId: Number(values.currencyId),
    expectedDate: values.expectedDate!,
    comment: values.comment || undefined,
    paymentLines: values.paymentLines.map(line => ({
      ...(line.id ? { id: line.id } : {}),
      invoiceId: Number(line.invoiceId),
      amount: Number(line.amount),
    })),
  };
}

export function getDefaultEurCurrencyId(
  currencies: Record<number, string>,
): number | undefined {
  return findRecordIdByName(currencies, 'EUR');
}

export function validatePaymentForm(values: PaymentFormValues): string | null {
  if (!values.sellerId || !values.buyerId || !values.currencyId) {
    return 'required';
  }

  if (!values.expectedDate) {
    return 'expectedDate';
  }

  if (
    !values.paymentLines.length ||
    values.paymentLines.some(
      line => !line.invoiceId || !line.amount || line.amount <= 0,
    )
  ) {
    return 'paymentLines';
  }

  return null;
}
