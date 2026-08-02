import { EMPTY_BATCHED_PRODUCT_LINE } from '@/constants/document-lines.constants';
import { findRecordIdByName } from '@/helpers/select.helpers';
import type {
  CreateReceivePayload,
  Receive,
  ReceiveFormValues,
  UpdateReceivePayload,
} from '@/types/documents/receives.types';
import type { Shipment } from '@/types/documents/shipments.types';

export function createEmptyReceiveFormValues(
  defaultCurrencyId?: number,
): ReceiveFormValues {
  return {
    sellerId: null,
    buyerId: null,
    buyerWarehouseId: null,
    currencyId: defaultCurrencyId ? String(defaultCurrencyId) : null,
    shipmentId: null,
    expectedDate: new Date(),
    incotermsId: null,
    transportPlace: '',
    transportAmount: 0,
    comment: '',
    receiveLines: [{ ...EMPTY_BATCHED_PRODUCT_LINE }],
    receiveServiceLines: [],
  };
}

export function receiveToFormValues(receive: Receive): ReceiveFormValues {
  return {
    sellerId: String(receive.sellerId),
    buyerId: String(receive.buyerId),
    buyerWarehouseId: String(receive.buyerWarehouseId),
    currencyId: String(receive.currencyId),
    shipmentId: receive.shipment?.id ? String(receive.shipment.id) : null,
    expectedDate: receive.expectedDate
      ? new Date(receive.expectedDate)
      : null,
    incotermsId: receive.incotermsId ? String(receive.incotermsId) : null,
    transportPlace: receive.transportPlace ?? '',
    transportAmount: Number(receive.transportAmount) || 0,
    comment: receive.comment ?? '',
    receiveLines: (receive.receiveLines ?? []).map(line => ({
      id: line.id,
      productId: String(line.productId),
      batchId: String(line.batchId),
      packageId: String(line.packageId),
      qty: Number(line.qty) || 0,
      price: Number(line.price) || 0,
    })),
    receiveServiceLines: (receive.receiveServiceLines ?? []).map(line => ({
      id: line.id,
      serviceId: String(line.serviceId),
      qty: Number(line.qty) || 0,
      price: Number(line.price) || 0,
    })),
  };
}

export function prefillReceiveFromShipment(
  shipment: Shipment,
  defaultCurrencyId?: number,
): ReceiveFormValues {
  return {
    sellerId: String(shipment.sellerId),
    buyerId: String(shipment.buyerId),
    buyerWarehouseId: shipment.invoice.buyerWarehouseId
      ? String(shipment.invoice.buyerWarehouseId)
      : null,
    currencyId: String(shipment.currencyId ?? defaultCurrencyId ?? ''),
    shipmentId: String(shipment.id),
    expectedDate: shipment.expectedDate
      ? new Date(shipment.expectedDate)
      : new Date(),
    incotermsId: shipment.incotermsId ? String(shipment.incotermsId) : null,
    transportPlace: shipment.transportPlace ?? '',
    transportAmount: Number(shipment.transportAmount) || 0,
    comment: '',
    receiveLines: (() => {
      const lines = (shipment.shipmentLines ?? []).map(line => ({
        productId: String(line.productId),
        batchId: line.batchId ? String(line.batchId) : null,
        packageId: String(line.packageId),
        qty: Number(line.qty) || 0,
        price: Number(line.price) || 0,
      }));

      return lines.length ? lines : [{ ...EMPTY_BATCHED_PRODUCT_LINE }];
    })(),
    receiveServiceLines: (shipment.shipmentServiceLines ?? []).map(line => ({
      serviceId: String(line.serviceId),
      qty: Number(line.qty) || 0,
      price: Number(line.price) || 0,
    })),
  };
}

function toPayloadBase(values: ReceiveFormValues) {
  return {
    sellerId: Number(values.sellerId),
    buyerId: Number(values.buyerId),
    buyerWarehouseId: Number(values.buyerWarehouseId),
    currencyId: Number(values.currencyId),
    shipmentId: Number(values.shipmentId),
    expectedDate: values.expectedDate!,
    incotermsId: Number(values.incotermsId),
    transportPlace: values.transportPlace || undefined,
    transportAmount:
      values.transportAmount == null
        ? undefined
        : Number(values.transportAmount),
    comment: values.comment || undefined,
  };
}

export function formValuesToCreatePayload(
  values: ReceiveFormValues,
): CreateReceivePayload {
  return {
    ...toPayloadBase(values),
    receiveLines: values.receiveLines.map(line => ({
      productId: Number(line.productId),
      batchId: Number(line.batchId),
      packageId: Number(line.packageId),
      qty: Number(line.qty),
      price: Number(line.price),
    })),
    receiveServiceLines: values.receiveServiceLines.map(line => ({
      serviceId: Number(line.serviceId),
      qty: Number(line.qty),
      price: Number(line.price),
    })),
  };
}

export function formValuesToUpdatePayload(
  values: ReceiveFormValues,
): UpdateReceivePayload {
  return {
    ...toPayloadBase(values),
    receiveLines: values.receiveLines.map(line => ({
      ...(line.id ? { id: line.id } : {}),
      productId: Number(line.productId),
      batchId: Number(line.batchId),
      packageId: Number(line.packageId),
      qty: Number(line.qty),
      price: Number(line.price),
    })),
    receiveServiceLines: values.receiveServiceLines.map(line => ({
      ...(line.id ? { id: line.id } : {}),
      serviceId: Number(line.serviceId),
      qty: Number(line.qty),
      price: Number(line.price),
    })),
  };
}

export function getDefaultEurCurrencyId(
  currencies: Record<number, string>,
): number | undefined {
  return findRecordIdByName(currencies, 'EUR');
}

export function validateReceiveForm(values: ReceiveFormValues): string | null {
  if (
    !values.sellerId ||
    !values.buyerId ||
    !values.buyerWarehouseId ||
    !values.currencyId ||
    !values.shipmentId ||
    !values.incotermsId
  ) {
    return 'required';
  }

  if (!values.expectedDate) {
    return 'expectedDate';
  }

  if (
    !values.receiveLines.length ||
    values.receiveLines.some(
      line =>
        !line.productId ||
        !line.batchId ||
        !line.packageId ||
        !line.qty ||
        line.qty <= 0 ||
        line.price == null ||
        line.price < 0,
    )
  ) {
    return 'productLines';
  }

  if (
    values.receiveServiceLines.some(
      line =>
        !line.serviceId ||
        !line.qty ||
        line.qty <= 0 ||
        !line.price ||
        line.price <= 0,
    )
  ) {
    return 'serviceLines';
  }

  return null;
}
