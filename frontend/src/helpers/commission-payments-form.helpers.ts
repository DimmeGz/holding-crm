import { findRecordIdByName } from '@/helpers/select.helpers';
import type { GetCommissionInvoiceDto } from '@/types/documents/commission-invoices.types';
import type {
  CommissionPaymentFormValues,
  CreateCommissionPaymentPayload,
  GetCommissionPaymentDto,
  UpdateCommissionPaymentPayload,
} from '@/types/documents/commission-payments.types';

export function createEmptyCommissionPaymentFormValues(
  defaultCurrencyId?: number,
): CommissionPaymentFormValues {
  return {
    sellerId: null,
    buyerId: null,
    currencyId: defaultCurrencyId ? String(defaultCurrencyId) : null,
    expectedDate: new Date(),
    comment: '',
    commissionPaymentLines: [{ commissionInvoiceId: null, amount: 0 }],
  };
}

export function commissionPaymentToFormValues(
  payment: GetCommissionPaymentDto,
): CommissionPaymentFormValues {
  return {
    sellerId: String(payment.sellerId),
    buyerId: String(payment.buyerId),
    currencyId: String(payment.currencyId),
    expectedDate: payment.expectedDate
      ? new Date(payment.expectedDate)
      : null,
    comment: payment.comment ?? '',
    commissionPaymentLines: (payment.commissionPaymentLines ?? []).map(
      line => ({
        id: line.id,
        commissionInvoiceId: String(line.commissionInvoiceId),
        amount: Number(line.amount) || 0,
      }),
    ),
  };
}

export function prefillFromCommissionInvoices(
  commissions: GetCommissionInvoiceDto[],
  defaultCurrencyId?: number,
): CommissionPaymentFormValues {
  const first = commissions[0];

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
    commissionPaymentLines: commissions.map(commission => ({
      commissionInvoiceId: String(commission.id),
      amount: Number(commission.paymentBalance ?? commission.documentSum) || 0,
    })),
  };
}

export function formValuesToCreatePayload(
  values: CommissionPaymentFormValues,
): CreateCommissionPaymentPayload {
  return {
    sellerId: Number(values.sellerId),
    buyerId: Number(values.buyerId),
    currencyId: Number(values.currencyId),
    expectedDate: values.expectedDate ?? undefined,
    comment: values.comment || undefined,
    commissionPaymentLines: values.commissionPaymentLines.map(line => ({
      commissionInvoiceId: Number(line.commissionInvoiceId),
      amount: Number(line.amount),
    })),
  };
}

export function formValuesToUpdatePayload(
  values: CommissionPaymentFormValues,
): UpdateCommissionPaymentPayload {
  return {
    sellerId: Number(values.sellerId),
    buyerId: Number(values.buyerId),
    currencyId: Number(values.currencyId),
    expectedDate: values.expectedDate ?? undefined,
    comment: values.comment || undefined,
    commissionPaymentLines: values.commissionPaymentLines.map(line => ({
      ...(line.id ? { id: line.id } : {}),
      commissionInvoiceId: Number(line.commissionInvoiceId),
      amount: Number(line.amount),
    })),
  };
}

export function getDefaultEurCurrencyId(
  currencies: Record<number, string>,
): number | undefined {
  return findRecordIdByName(currencies, 'EUR');
}

export function validateCommissionPaymentForm(
  values: CommissionPaymentFormValues,
): string | null {
  if (!values.sellerId || !values.buyerId || !values.currencyId) {
    return 'required';
  }

  if (
    !values.commissionPaymentLines.length ||
    values.commissionPaymentLines.some(
      line =>
        !line.commissionInvoiceId || !line.amount || line.amount <= 0,
    )
  ) {
    return 'commissionPaymentLines';
  }

  return null;
}
