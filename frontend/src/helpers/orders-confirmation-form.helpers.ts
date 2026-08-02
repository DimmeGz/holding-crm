import { EMPTY_ORDER_PRODUCT_LINE } from '@/constants/document-lines.constants';
import type {
  CreateOrderConfirmationPayload,
  OrderConfirmationFormValues,
  UpdateOrderConfirmationPayload,
} from '@/types/documents/orders-confirmation.types';
import type {
  Confirmation,
  Order,
  OrderProductLineFormValue,
} from '@/types/documents/orders.types';

export function createEmptyConfirmationFormValues(): OrderConfirmationFormValues {
  return {
    confirmationNumber: '',
    buyerWarehouseId: null,
    recipientId: null,
    recipientWarehouseId: null,
    expectedDate: null,
    paymentDelay: 0,
    incotermsId: null,
    transportPlace: '',
    comment: '',
    orderLines: [{ ...EMPTY_ORDER_PRODUCT_LINE }],
  };
}

function mapOrderLinesToForm(
  lines: Order['orderLines'] | Confirmation['orderLines'],
): OrderProductLineFormValue[] {
  if (!lines?.length) {
    return [{ ...EMPTY_ORDER_PRODUCT_LINE }];
  }

  return lines.map(line => ({
    id: line.id,
    productManId: String(line.productManId),
    productBuyId: String(line.productBuyId),
    packageId: String(line.packageId),
    batchRename: '',
    qty: line.qty,
    price: line.price,
  }));
}

export function prefillConfirmationFromOrder(
  order: Order,
): OrderConfirmationFormValues {
  return {
    confirmationNumber: '',
    buyerWarehouseId: String(order.buyerWarehouseId),
    recipientId: order.recipientId ? String(order.recipientId) : null,
    recipientWarehouseId: order.recipientWarehouseId
      ? String(order.recipientWarehouseId)
      : null,
    expectedDate: order.expectedDate ? new Date(order.expectedDate) : null,
    paymentDelay: order.paymentDelay ?? 0,
    incotermsId: order.incotermsId ? String(order.incotermsId) : null,
    transportPlace: order.transportPlace ?? '',
    comment: '',
    orderLines: mapOrderLinesToForm(order.orderLines),
  };
}

export function confirmationToFormValues(
  confirmation: Confirmation,
): OrderConfirmationFormValues {
  return {
    confirmationNumber: confirmation.confirmationNumber ?? '',
    buyerWarehouseId: String(confirmation.buyerWarehouseId),
    recipientId: confirmation.recipientId
      ? String(confirmation.recipientId)
      : null,
    recipientWarehouseId: confirmation.recipientWarehouseId
      ? String(confirmation.recipientWarehouseId)
      : null,
    expectedDate: confirmation.expectedDate
      ? new Date(confirmation.expectedDate)
      : null,
    paymentDelay: confirmation.paymentDelay ?? 0,
    incotermsId: confirmation.incotermsId
      ? String(confirmation.incotermsId)
      : null,
    transportPlace: confirmation.transportPlace ?? '',
    comment: confirmation.comment ?? '',
    orderLines: mapOrderLinesToForm(confirmation.orderLines),
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

function mapProductLines(lines: OrderProductLineFormValue[]) {
  return filterProductLines(lines).map(line => ({
    ...(line.id ? { id: line.id } : {}),
    productManId: Number(line.productManId),
    productBuyId: Number(line.productBuyId),
    packageId: Number(line.packageId),
    qty: line.qty,
    price: line.price,
  }));
}

function mapEditableHeader(values: OrderConfirmationFormValues) {
  const hasRecipient = Boolean(values.recipientId);

  return {
    buyerWarehouseId: Number(values.buyerWarehouseId),
    recipientId: hasRecipient ? Number(values.recipientId) : null,
    recipientWarehouseId:
      hasRecipient && values.recipientWarehouseId
        ? Number(values.recipientWarehouseId)
        : null,
    paymentDelay: values.paymentDelay,
    confirmationNumber: values.confirmationNumber.trim(),
    expectedDate: values.expectedDate!,
    incotermsId: Number(values.incotermsId),
    transportPlace: values.transportPlace.trim(),
    comment: values.comment || undefined,
  };
}

export function formValuesToCreatePayload(
  order: Order,
  values: OrderConfirmationFormValues,
): CreateOrderConfirmationPayload {
  const header = mapEditableHeader(values);

  return {
    orderId: order.id,
    sellerId: order.sellerId,
    buyerId: order.buyerId,
    currencyId: order.currencyId,
    sellerWarehouseId: order.sellerWarehouseId,
    buyerWarehouseId: header.buyerWarehouseId,
    ...(header.recipientId != null
      ? { recipientId: header.recipientId }
      : {}),
    ...(header.recipientWarehouseId != null
      ? { recipientWarehouseId: header.recipientWarehouseId }
      : {}),
    paymentDelay: header.paymentDelay,
    confirmationNumber: header.confirmationNumber,
    expectedDate: header.expectedDate,
    incotermsId: header.incotermsId,
    transportPlace: header.transportPlace,
    comment: header.comment,
    orderLines: mapProductLines(values.orderLines),
  };
}

export function formValuesToUpdatePayload(
  values: OrderConfirmationFormValues,
): UpdateOrderConfirmationPayload {
  return {
    ...mapEditableHeader(values),
    orderLines: mapProductLines(values.orderLines),
  };
}

export function validateConfirmationForm(
  values: OrderConfirmationFormValues,
): string | null {
  if (
    !values.confirmationNumber.trim() ||
    !values.buyerWarehouseId ||
    !values.incotermsId ||
    !values.transportPlace.trim()
  ) {
    return 'required';
  }

  if (!/\d+$/.test(values.confirmationNumber.trim())) {
    return 'confirmationNumber';
  }

  if (!values.expectedDate) {
    return 'expectedDate';
  }

  if (filterProductLines(values.orderLines).length === 0) {
    return 'productLines';
  }

  return null;
}
