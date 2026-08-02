import { EMPTY_INVOICE_PRODUCT_LINE } from '@/constants/document-lines.constants';
import { findRecordIdByName } from '@/helpers/select.helpers';
import type {
  Contract,
  ServiceLineFormValue,
} from '@/types/documents/contracts.types';
import type {
  CreateInvoiceByContractPayload,
  CreateInvoicePayload,
  Invoice,
  InvoiceFormValues,
  InvoiceProductLineFormValue,
  UpdateInvoicePayload,
} from '@/types/documents/invoices.types';
import type {
  CompanyDefaultWarehouse,
  Order,
} from '@/types/documents/orders.types';

export function createEmptyInvoiceFormValues(
  defaultCurrencyId?: number,
): InvoiceFormValues {
  return {
    invoiceNumber: '',
    expectedDate: new Date(),
    sellerId: null,
    sellerWarehouseId: null,
    buyerId: null,
    buyerWarehouseId: null,
    recipientId: null,
    recipientWarehouseId: null,
    currencyId: defaultCurrencyId ? String(defaultCurrencyId) : null,
    vat: 0,
    paymentDelay: 0,
    invoiceId: null,
    contractId: null,
    incotermsId: null,
    transportPlace: '',
    carPlate: '',
    ponz: null,
    grossWeight: null,
    transportAmount: null,
    comment: '',
    contractInfo: '',
    reportPeriod: null,
    separation: false,
    reportDuplicating: false,
    invoiceLines: [{ ...EMPTY_INVOICE_PRODUCT_LINE }],
    invoiceServiceLines: [],
  };
}

export function invoiceToFormValues(invoice: Invoice): InvoiceFormValues {
  return {
    invoiceNumber: invoice.invoiceNumber ?? '',
    expectedDate: invoice.expectedDate ? new Date(invoice.expectedDate) : null,
    sellerId: String(invoice.sellerId),
    sellerWarehouseId: String(invoice.sellerWarehouseId),
    buyerId: String(invoice.buyerId),
    buyerWarehouseId: String(invoice.buyerWarehouseId),
    recipientId: invoice.recipientId ? String(invoice.recipientId) : null,
    recipientWarehouseId: invoice.recipientWarehouseId
      ? String(invoice.recipientWarehouseId)
      : null,
    currencyId: String(invoice.currencyId),
    vat: invoice.vat ?? 0,
    paymentDelay: invoice.paymentDelay ?? 0,
    invoiceId: invoice.parent?.id ?? null,
    contractId: null,
    incotermsId: invoice.incotermsId ? String(invoice.incotermsId) : null,
    transportPlace: invoice.transportPlace ?? '',
    carPlate: invoice.carPlate ?? '',
    ponz: invoice.ponz ?? null,
    grossWeight: invoice.grossWeight ?? null,
    transportAmount: invoice.transportAmount ?? null,
    comment: invoice.comment ?? '',
    contractInfo: invoice.contractInfo ?? '',
    reportPeriod: invoice.reportPeriod ? new Date(invoice.reportPeriod) : null,
    separation: Boolean(invoice.separation),
    reportDuplicating: Boolean(invoice.reportDuplicating),
    invoiceLines: (invoice.invoiceLines ?? []).map(line => ({
      id: line.id,
      orderId: String(line.orderId ?? line.order?.id ?? ''),
      productId: String(line.productId),
      batchId: String(line.batchId ?? line.batch?.id ?? ''),
      packageId: String(line.packageId),
      palletsQty: line.palletsQty ?? 1,
      qty: line.qty,
      price: line.price,
      cost: line.cost ?? null,
      countryOfOriginId: line.countryOfOriginId
        ? String(line.countryOfOriginId)
        : null,
      grossWeight: line.grossWeight ?? null,
    })),
    invoiceServiceLines: (invoice.invoiceServiceLines ?? []).map(line => ({
      id: line.id,
      serviceId: String(line.serviceId),
      qty: line.qty,
      price: line.price,
    })),
  };
}

function filterProductLines(
  lines: InvoiceProductLineFormValue[],
  requireOrderId: boolean,
): InvoiceProductLineFormValue[] {
  return lines.filter(
    line =>
      line.productId &&
      line.batchId &&
      line.packageId &&
      line.qty > 0 &&
      line.price >= 0 &&
      (!requireOrderId || Boolean(line.orderId)),
  );
}

function filterServiceLines(
  lines: ServiceLineFormValue[],
): ServiceLineFormValue[] {
  return lines.filter(line => line.serviceId);
}

function mapProductLineFields(
  line: InvoiceProductLineFormValue,
  includeOrderId: boolean,
) {
  return {
    ...(line.id ? { id: line.id } : {}),
    productId: Number(line.productId),
    batchId: Number(line.batchId),
    packageId: Number(line.packageId),
    palletsQty: line.palletsQty || 1,
    qty: line.qty,
    price: line.price,
    ...(line.cost != null && line.cost > 0 ? { cost: line.cost } : {}),
    ...(line.countryOfOriginId
      ? { countryOfOriginId: Number(line.countryOfOriginId) }
      : {}),
    ...(line.grossWeight != null && line.grossWeight > 0
      ? { grossWeight: line.grossWeight }
      : {}),
    ...(includeOrderId ? { orderId: Number(line.orderId) } : {}),
  };
}

function mapServiceLines(lines: ServiceLineFormValue[]) {
  return filterServiceLines(lines).map(line => ({
    ...(line.id ? { id: line.id } : {}),
    serviceId: Number(line.serviceId),
    qty: line.qty,
    price: line.price,
  }));
}

function mapHeaderFields(values: InvoiceFormValues) {
  const hasRecipient = Boolean(values.recipientId);

  return {
    invoiceNumber: values.invoiceNumber.trim(),
    expectedDate: values.expectedDate ?? new Date(),
    sellerId: Number(values.sellerId),
    sellerWarehouseId: Number(values.sellerWarehouseId),
    buyerId: Number(values.buyerId),
    buyerWarehouseId: Number(values.buyerWarehouseId),
    ...(hasRecipient
      ? {
          recipientId: Number(values.recipientId),
          ...(values.recipientWarehouseId
            ? { recipientWarehouseId: Number(values.recipientWarehouseId) }
            : {}),
        }
      : {}),
    currencyId: Number(values.currencyId),
    vat: values.vat,
    paymentDelay: values.paymentDelay,
    ...(values.invoiceId ? { invoiceId: values.invoiceId } : {}),
    incotermsId: Number(values.incotermsId),
    transportPlace: values.transportPlace || undefined,
    carPlate: values.carPlate || undefined,
    ...(values.ponz != null && values.ponz > 0 ? { ponz: values.ponz } : {}),
    ...(values.grossWeight != null && values.grossWeight > 0
      ? { grossWeight: values.grossWeight }
      : {}),
    ...(values.transportAmount != null && values.transportAmount > 0
      ? { transportAmount: values.transportAmount }
      : {}),
    comment: values.comment || undefined,
    contractInfo: values.contractInfo || undefined,
    ...(values.reportPeriod ? { reportPeriod: values.reportPeriod } : {}),
    separation: values.separation,
    reportDuplicating: values.reportDuplicating,
  };
}

export function formValuesToCreatePayload(
  values: InvoiceFormValues,
): CreateInvoicePayload {
  return {
    ...mapHeaderFields(values),
    invoiceLines: filterProductLines(values.invoiceLines, true).map(line =>
      mapProductLineFields(line, true),
    ) as CreateInvoicePayload['invoiceLines'],
    invoiceServiceLines: mapServiceLines(values.invoiceServiceLines),
  };
}

export function formValuesToCreateByContractPayload(
  values: InvoiceFormValues,
): CreateInvoiceByContractPayload {
  const { invoiceId: _ignoredParentId, ...header } = mapHeaderFields(values);

  return {
    ...header,
    contractId: Number(values.contractId),
    invoiceLines: filterProductLines(values.invoiceLines, false).map(line =>
      mapProductLineFields(line, false),
    ) as CreateInvoiceByContractPayload['invoiceLines'],
    invoiceServiceLines: mapServiceLines(values.invoiceServiceLines),
  };
}

export function formValuesToUpdatePayload(
  values: InvoiceFormValues,
): UpdateInvoicePayload {
  const { invoiceId: _ignoredParentId, ...header } = mapHeaderFields(values);

  return {
    ...header,
    invoiceLines: filterProductLines(values.invoiceLines, true).map(line =>
      mapProductLineFields(line, true),
    ) as UpdateInvoicePayload['invoiceLines'],
    invoiceServiceLines: mapServiceLines(values.invoiceServiceLines),
  };
}

export function prefillFromContract(
  contract: Contract,
  sellerCompany?: CompanyDefaultWarehouse | null,
  buyerCompany?: CompanyDefaultWarehouse | null,
  defaultCurrencyId?: number,
): InvoiceFormValues {
  return {
    ...createEmptyInvoiceFormValues(defaultCurrencyId),
    contractId: String(contract.id),
    sellerId: String(contract.sellerId),
    buyerId: String(contract.buyerId),
    sellerWarehouseId: sellerCompany?.defaultWarehouseId
      ? String(sellerCompany.defaultWarehouseId)
      : null,
    buyerWarehouseId: buyerCompany?.defaultWarehouseId
      ? String(buyerCompany.defaultWarehouseId)
      : null,
    currencyId: String(contract.currencyId),
    vat: contract.vat ?? 0,
    paymentDelay: contract.paymentDelay ?? 0,
    incotermsId: contract.incotermsId ? String(contract.incotermsId) : null,
    transportPlace: contract.transportPlace ?? '',
    expectedDate: new Date(),
    invoiceLines:
      contract.contractLines.length > 0
        ? contract.contractLines.map(line => ({
            ...EMPTY_INVOICE_PRODUCT_LINE,
            productId: String(line.productId),
            packageId: String(line.packageId),
            qty: line.shipQty,
            price: line.price,
            palletsQty: 1,
          }))
        : [{ ...EMPTY_INVOICE_PRODUCT_LINE }],
    invoiceServiceLines: (contract.contractServiceLines ?? []).map(line => ({
      serviceId: String(line.serviceId),
      qty: line.qty,
      price: line.price,
    })),
  };
}

export function prefillFromOrders(
  orders: Order[],
  defaultCurrencyId?: number,
): InvoiceFormValues {
  const first = orders[0];
  if (!first) {
    return createEmptyInvoiceFormValues(defaultCurrencyId);
  }

  const confirmation = first.confirmation;
  const invoiceLines: InvoiceProductLineFormValue[] = [];
  const invoiceServiceLines: ServiceLineFormValue[] = [];

  for (const order of orders) {
    const sourceLines = order.confirmation?.orderLines?.length
      ? order.confirmation.orderLines
      : order.orderLines;

    for (const line of sourceLines ?? []) {
      invoiceLines.push({
        ...EMPTY_INVOICE_PRODUCT_LINE,
        orderId: String(order.id),
        productId: String(line.productBuyId),
        packageId: String(line.packageId),
        qty: line.qty,
        price: line.price,
        palletsQty: 1,
      });
    }

    for (const serviceLine of order.orderServiceLines ?? []) {
      invoiceServiceLines.push({
        serviceId: String(serviceLine.serviceId),
        qty: serviceLine.qty,
        price: serviceLine.price,
      });
    }
  }

  return {
    ...createEmptyInvoiceFormValues(defaultCurrencyId),
    expectedDate: new Date(),
    sellerId: String(first.sellerId),
    sellerWarehouseId: String(
      confirmation?.sellerWarehouseId ?? first.sellerWarehouseId,
    ),
    buyerId: String(first.buyerId),
    buyerWarehouseId: String(
      confirmation?.buyerWarehouseId ?? first.buyerWarehouseId,
    ),
    recipientId: confirmation?.recipientId
      ? String(confirmation.recipientId)
      : first.recipientId
        ? String(first.recipientId)
        : null,
    recipientWarehouseId: confirmation?.recipientWarehouseId
      ? String(confirmation.recipientWarehouseId)
      : first.recipientWarehouseId
        ? String(first.recipientWarehouseId)
        : null,
    currencyId: String(first.currencyId),
    vat: first.vat ?? 0,
    paymentDelay: confirmation?.paymentDelay ?? first.paymentDelay ?? 0,
    incotermsId: String(
      confirmation?.incotermsId ?? first.incotermsId ?? '',
    ) || null,
    transportPlace:
      confirmation?.transportPlace ?? first.transportPlace ?? '',
    carPlate: first.carPlate ?? '',
    invoiceLines:
      invoiceLines.length > 0
        ? invoiceLines
        : [{ ...EMPTY_INVOICE_PRODUCT_LINE }],
    invoiceServiceLines,
  };
}

export function prefillFromParentInvoice(
  parent: Invoice,
  defaultCurrencyId?: number,
): InvoiceFormValues | null {
  if (!parent.recipientId) {
    return null;
  }

  return {
    ...createEmptyInvoiceFormValues(defaultCurrencyId),
    invoiceId: parent.id,
    expectedDate: new Date(),
    sellerId: String(parent.buyerId),
    sellerWarehouseId: String(parent.buyerWarehouseId),
    buyerId: String(parent.recipientId),
    buyerWarehouseId: parent.recipientWarehouseId
      ? String(parent.recipientWarehouseId)
      : null,
    recipientId: null,
    recipientWarehouseId: null,
    currencyId: String(parent.currencyId),
    paymentDelay: parent.paymentDelay ?? 0,
    incotermsId: parent.incotermsId ? String(parent.incotermsId) : null,
    transportPlace: parent.transportPlace ?? '',
    grossWeight: parent.grossWeight ?? null,
    invoiceLines:
      parent.invoiceLines.length > 0
        ? parent.invoiceLines.map(line => ({
            ...EMPTY_INVOICE_PRODUCT_LINE,
            orderId: String(line.orderId ?? line.order?.id ?? ''),
            productId: String(line.productId),
            batchId: String(line.batchId ?? line.batch?.id ?? ''),
            packageId: String(line.packageId),
            qty: line.qty,
            price: line.price,
            palletsQty: line.palletsQty ?? 1,
            countryOfOriginId: line.countryOfOriginId
              ? String(line.countryOfOriginId)
              : null,
          }))
        : [{ ...EMPTY_INVOICE_PRODUCT_LINE }],
    invoiceServiceLines: [],
  };
}

export function getDefaultEurCurrencyId(
  currencies: Record<number, string>,
): number | undefined {
  return findRecordIdByName(currencies, 'EUR');
}

export function validateInvoiceForm(
  values: InvoiceFormValues,
  mode: 'create' | 'edit' | 'createByContract',
): string | null {
  if (!values.invoiceNumber.trim()) {
    return 'invoiceNumberRequired';
  }

  if (values.invoiceNumber.trim().length > 15) {
    return 'invoiceNumberMaxLength';
  }

  if (
    !values.sellerId ||
    !values.sellerWarehouseId ||
    !values.buyerId ||
    !values.buyerWarehouseId ||
    !values.currencyId ||
    !values.incotermsId ||
    !values.expectedDate
  ) {
    return 'required';
  }

  if (mode === 'createByContract' && !values.contractId) {
    return 'required';
  }

  const requireOrderId = mode !== 'createByContract';
  if (filterProductLines(values.invoiceLines, requireOrderId).length === 0) {
    return 'productLines';
  }

  return null;
}
