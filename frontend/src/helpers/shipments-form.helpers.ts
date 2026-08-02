import { EMPTY_BATCHED_PRODUCT_LINE } from '@/constants/document-lines.constants';
import { findRecordIdByName } from '@/helpers/select.helpers';
import type { Invoice } from '@/types/documents/invoices.types';
import type {
  CreateShipmentPayload,
  Shipment,
  ShipmentFormValues,
  UpdateShipmentPayload,
} from '@/types/documents/shipments.types';

export function createEmptyShipmentFormValues(
  defaultCurrencyId?: number,
): ShipmentFormValues {
  return {
    sellerId: null,
    sellerWarehouseId: null,
    buyerId: null,
    currencyId: defaultCurrencyId ? String(defaultCurrencyId) : null,
    invoiceId: null,
    expectedDate: new Date(),
    incotermsId: null,
    transportPlace: '',
    transportAmount: 0,
    comment: '',
    shipmentLines: [{ ...EMPTY_BATCHED_PRODUCT_LINE }],
    shipmentServiceLines: [],
  };
}

export function shipmentToFormValues(shipment: Shipment): ShipmentFormValues {
  return {
    sellerId: String(shipment.sellerId),
    sellerWarehouseId: String(shipment.sellerWarehouseId),
    buyerId: String(shipment.buyerId),
    currencyId: String(shipment.currencyId),
    invoiceId: String(shipment.invoice.id),
    expectedDate: shipment.expectedDate
      ? new Date(shipment.expectedDate)
      : null,
    incotermsId: shipment.incotermsId ? String(shipment.incotermsId) : null,
    transportPlace: shipment.transportPlace ?? '',
    transportAmount: Number(shipment.transportAmount) || 0,
    comment: shipment.comment ?? '',
    shipmentLines: (shipment.shipmentLines ?? []).map(line => ({
      id: line.id,
      productId: String(line.productId),
      batchId: String(line.batchId),
      packageId: String(line.packageId),
      qty: Number(line.qty) || 0,
      price: Number(line.price) || 0,
    })),
    shipmentServiceLines: (shipment.shipmentServiceLines ?? []).map(line => ({
      id: line.id,
      serviceId: String(line.serviceId),
      qty: Number(line.qty) || 0,
      price: Number(line.price) || 0,
    })),
  };
}

export function prefillShipmentFromInvoice(
  invoice: Invoice,
  defaultCurrencyId?: number,
): ShipmentFormValues {
  return {
    sellerId: String(invoice.sellerId),
    sellerWarehouseId: String(invoice.sellerWarehouseId),
    buyerId: String(invoice.buyerId),
    currencyId: String(invoice.currencyId ?? defaultCurrencyId ?? ''),
    invoiceId: String(invoice.id),
    expectedDate: invoice.expectedDate
      ? new Date(invoice.expectedDate)
      : new Date(),
    incotermsId: invoice.incotermsId ? String(invoice.incotermsId) : null,
    transportPlace: invoice.transportPlace ?? '',
    transportAmount: Number(invoice.transportAmount) || 0,
    comment: '',
    shipmentLines: (() => {
      const lines = (invoice.invoiceLines ?? []).map(line => ({
        productId: String(line.productId),
        batchId: line.batchId ? String(line.batchId) : null,
        packageId: String(line.packageId),
        qty: Number(line.qty) || 0,
        price: Number(line.price) || 0,
      }));

      return lines.length ? lines : [{ ...EMPTY_BATCHED_PRODUCT_LINE }];
    })(),
    shipmentServiceLines: (invoice.invoiceServiceLines ?? []).map(line => ({
      serviceId: String(line.serviceId),
      qty: Number(line.qty) || 0,
      price: Number(line.price) || 0,
    })),
  };
}

function toPayloadBase(values: ShipmentFormValues) {
  return {
    sellerId: Number(values.sellerId),
    sellerWarehouseId: Number(values.sellerWarehouseId),
    buyerId: Number(values.buyerId),
    currencyId: Number(values.currencyId),
    invoiceId: Number(values.invoiceId),
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
  values: ShipmentFormValues,
): CreateShipmentPayload {
  return {
    ...toPayloadBase(values),
    shipmentLines: values.shipmentLines.map(line => ({
      productId: Number(line.productId),
      batchId: Number(line.batchId),
      packageId: Number(line.packageId),
      qty: Number(line.qty),
      price: Number(line.price),
    })),
    shipmentServiceLines: values.shipmentServiceLines.map(line => ({
      serviceId: Number(line.serviceId),
      qty: Number(line.qty),
      price: Number(line.price),
    })),
  };
}

export function formValuesToUpdatePayload(
  values: ShipmentFormValues,
): UpdateShipmentPayload {
  return {
    ...toPayloadBase(values),
    shipmentLines: values.shipmentLines.map(line => ({
      ...(line.id ? { id: line.id } : {}),
      productId: Number(line.productId),
      batchId: Number(line.batchId),
      packageId: Number(line.packageId),
      qty: Number(line.qty),
      price: Number(line.price),
    })),
    shipmentServiceLines: values.shipmentServiceLines.map(line => ({
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

export function validateShipmentForm(
  values: ShipmentFormValues,
): string | null {
  if (
    !values.sellerId ||
    !values.sellerWarehouseId ||
    !values.buyerId ||
    !values.currencyId ||
    !values.invoiceId ||
    !values.incotermsId
  ) {
    return 'required';
  }

  if (!values.expectedDate) {
    return 'expectedDate';
  }

  if (
    !values.shipmentLines.length ||
    values.shipmentLines.some(
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
    values.shipmentServiceLines.some(
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
