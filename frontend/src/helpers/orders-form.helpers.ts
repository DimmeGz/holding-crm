import { EMPTY_ORDER_PRODUCT_LINE } from '@/constants/document-lines.constants';
import { findRecordIdByName } from '@/helpers/select.helpers';
import type {
  Contract,
  ServiceLineFormValue,
} from '@/types/documents/contracts.types';
import type {
  CompanyDefaultWarehouse,
  CreateOrderPayload,
  Order,
  OrderFormValues,
  OrderProductLineFormValue,
  UpdateOrderPayload,
} from '@/types/documents/orders.types';

export function createEmptyOrderFormValues(
  defaultCurrencyId?: number,
): OrderFormValues {
  return {
    orderNumber: '',
    contractId: null,
    signatureDate: new Date(),
    expectedDate: null,
    isDateAsap: false,
    sellerId: null,
    sellerWarehouseId: null,
    buyerId: null,
    buyerWarehouseId: null,
    recipientId: null,
    recipientWarehouseId: null,
    currencyId: defaultCurrencyId ? String(defaultCurrencyId) : null,
    vat: 0,
    paymentDelay: 0,
    incotermsId: null,
    transportPlace: '',
    carPlate: '',
    comment: '',
    isHidden: false,
    orderLines: [{ ...EMPTY_ORDER_PRODUCT_LINE }],
    orderServiceLines: [],
  };
}

export function orderToFormValues(order: Order): OrderFormValues {
  return {
    orderNumber: order.orderNumber ?? '',
    contractId: String(order.contractId ?? order.contract?.id),
    signatureDate: order.signatureDate
      ? new Date(order.signatureDate)
      : new Date(),
    expectedDate: order.expectedDate ? new Date(order.expectedDate) : null,
    isDateAsap: Boolean(order.isDateAsap),
    sellerId: String(order.sellerId),
    sellerWarehouseId: String(order.sellerWarehouseId),
    buyerId: String(order.buyerId),
    buyerWarehouseId: String(order.buyerWarehouseId),
    recipientId: order.recipientId ? String(order.recipientId) : null,
    recipientWarehouseId: order.recipientWarehouseId
      ? String(order.recipientWarehouseId)
      : null,
    currencyId: String(order.currencyId),
    vat: order.vat ?? 0,
    paymentDelay: order.paymentDelay ?? 0,
    incotermsId: order.incotermsId ? String(order.incotermsId) : null,
    transportPlace: order.transportPlace ?? '',
    carPlate: order.carPlate ?? '',
    comment: order.comment ?? '',
    isHidden: Boolean(order.isHidden),
    orderLines: (order.orderLines ?? []).map(line => ({
      id: line.id,
      productManId: String(line.productManId),
      productBuyId: String(line.productBuyId),
      packageId: String(line.packageId),
      batchRename: line.batchRename ?? '',
      qty: line.qty,
      price: line.price,
    })),
    orderServiceLines: (order.orderServiceLines ?? []).map(line => ({
      id: line.id,
      serviceId: String(line.serviceId),
      qty: line.qty,
      price: line.price,
    })),
  };
}

function filterProductLines(
  lines: OrderProductLineFormValue[],
): OrderProductLineFormValue[] {
  return lines.filter(
    line =>
      line.productManId &&
      line.productBuyId &&
      line.packageId &&
      line.qty > 0,
  );
}

function filterServiceLines(
  lines: ServiceLineFormValue[],
): ServiceLineFormValue[] {
  return lines.filter(line => line.serviceId);
}

function mapProductLines(lines: OrderProductLineFormValue[]) {
  return filterProductLines(lines).map(line => ({
    ...(line.id ? { id: line.id } : {}),
    productManId: Number(line.productManId),
    productBuyId: Number(line.productBuyId),
    packageId: Number(line.packageId),
    qty: line.qty,
    price: line.price,
    ...(line.batchRename.trim()
      ? { batchRename: line.batchRename.trim() }
      : {}),
  }));
}

function mapServiceLines(lines: ServiceLineFormValue[]) {
  return filterServiceLines(lines).map(line => ({
    ...(line.id ? { id: line.id } : {}),
    serviceId: Number(line.serviceId),
    qty: line.qty,
    price: line.price,
  }));
}

function mapHeaderFields(values: OrderFormValues) {
  const hasRecipient = Boolean(values.recipientId);

  return {
    contractId: Number(values.contractId),
    signatureDate: values.signatureDate ?? undefined,
    ...(values.isDateAsap
      ? { isDateAsap: true }
      : { expectedDate: values.expectedDate ?? undefined }),
    sellerId: Number(values.sellerId),
    sellerWarehouseId: Number(values.sellerWarehouseId),
    buyerId: Number(values.buyerId),
    buyerWarehouseId: Number(values.buyerWarehouseId),
    recipientId: hasRecipient ? Number(values.recipientId) : null,
    recipientWarehouseId:
      hasRecipient && values.recipientWarehouseId
        ? Number(values.recipientWarehouseId)
        : null,
    currencyId: Number(values.currencyId),
    vat: values.vat,
    paymentDelay: values.paymentDelay,
    incotermsId: Number(values.incotermsId),
    transportPlace: values.transportPlace || undefined,
    carPlate: values.carPlate || undefined,
    comment: values.comment || undefined,
    isHidden: values.isHidden,
  };
}

export function formValuesToCreatePayload(
  values: OrderFormValues,
): CreateOrderPayload {
  return {
    ...mapHeaderFields(values),
    ...(values.orderNumber.trim()
      ? { orderNumber: values.orderNumber.trim() }
      : {}),
    orderLines: mapProductLines(values.orderLines),
    orderServiceLines: mapServiceLines(values.orderServiceLines),
  };
}

export function formValuesToUpdatePayload(
  values: OrderFormValues,
): UpdateOrderPayload {
  return {
    ...mapHeaderFields(values),
    orderNumber: values.orderNumber.trim(),
    orderLines: mapProductLines(values.orderLines),
    orderServiceLines: mapServiceLines(values.orderServiceLines),
  };
}

export function prefillFromContract(
  contract: Contract,
  sellerCompany?: CompanyDefaultWarehouse | null,
  buyerCompany?: CompanyDefaultWarehouse | null,
  defaultCurrencyId?: number,
): OrderFormValues {
  return {
    ...createEmptyOrderFormValues(defaultCurrencyId),
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
    orderLines:
      contract.contractLines.length > 0
        ? contract.contractLines.map(line => ({
            productManId: String(line.productId),
            productBuyId: String(line.productId),
            packageId: String(line.packageId),
            batchRename: '',
            qty: line.shipQty,
            price: line.price,
          }))
        : [{ ...EMPTY_ORDER_PRODUCT_LINE }],
    orderServiceLines: (contract.contractServiceLines ?? []).map(line => ({
      serviceId: String(line.serviceId),
      qty: line.qty,
      price: line.price,
    })),
  };
}

export function getDefaultEurCurrencyId(
  currencies: Record<number, string>,
): number | undefined {
  return findRecordIdByName(currencies, 'EUR');
}

export function validateOrderForm(values: OrderFormValues): string | null {
  if (
    !values.contractId ||
    !values.sellerId ||
    !values.sellerWarehouseId ||
    !values.buyerId ||
    !values.buyerWarehouseId ||
    !values.currencyId ||
    !values.incotermsId
  ) {
    return 'required';
  }

  const hasDate = Boolean(values.expectedDate);
  if (values.isDateAsap === hasDate) {
    return 'expectedDate';
  }

  if (filterProductLines(values.orderLines).length === 0) {
    return 'productLines';
  }

  return null;
}
