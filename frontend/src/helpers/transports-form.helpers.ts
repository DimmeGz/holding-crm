import { EMPTY_BATCHED_PRODUCT_LINE } from '@/constants/document-lines.constants';
import type {
  CreateTransportPayload,
  GetTransportDto,
  TransportFormValues,
  UpdateTransportPayload,
} from '@/types/documents/transports.types';

export function createEmptyTransportFormValues(): TransportFormValues {
  return {
    companyId: null,
    warehouseSenderId: null,
    warehouseReceiveId: null,
    expectedDate: new Date(),
    comment: '',
    productTransportLines: [{ ...EMPTY_BATCHED_PRODUCT_LINE }],
    productTransportServiceLines: [],
  };
}

export function transportToFormValues(
  transport: GetTransportDto,
): TransportFormValues {
  return {
    companyId: String(transport.companyId),
    warehouseSenderId: String(transport.warehouseSenderId),
    warehouseReceiveId: String(transport.warehouseReceiveId),
    expectedDate: transport.expectedDate
      ? new Date(transport.expectedDate)
      : null,
    comment: transport.comment ?? '',
    productTransportLines: (transport.productTransportLines ?? []).map(
      line => ({
        id: line.id,
        productId: String(line.productId),
        batchId: String(line.batchId),
        packageId: String(line.packageId),
        qty: Number(line.qty) || 0,
        price: 0,
      }),
    ),
    productTransportServiceLines: (
      transport.productTransportServiceLines ?? []
    ).map(line => ({
      id: line.id,
      serviceId: String(line.serviceId),
      qty: Number(line.qty) || 0,
      price: Number(line.price) || 0,
    })),
  };
}

export function formValuesToCreatePayload(
  values: TransportFormValues,
): CreateTransportPayload {
  return {
    companyId: Number(values.companyId),
    warehouseSenderId: Number(values.warehouseSenderId),
    warehouseReceiveId: Number(values.warehouseReceiveId),
    expectedDate: values.expectedDate ?? undefined,
    comment: values.comment || undefined,
    productTransportLines: values.productTransportLines.map(line => ({
      productId: Number(line.productId),
      batchId: Number(line.batchId),
      packageId: Number(line.packageId),
      qty: Number(line.qty),
    })),
    productTransportServiceLines: values.productTransportServiceLines.map(
      line => ({
        serviceId: Number(line.serviceId),
        qty: Number(line.qty),
        price: Number(line.price),
      }),
    ),
  };
}

export function formValuesToUpdatePayload(
  values: TransportFormValues,
): UpdateTransportPayload {
  return {
    companyId: Number(values.companyId),
    warehouseSenderId: Number(values.warehouseSenderId),
    warehouseReceiveId: Number(values.warehouseReceiveId),
    expectedDate: values.expectedDate ?? undefined,
    comment: values.comment || undefined,
    productTransportLines: values.productTransportLines.map(line => ({
      ...(line.id ? { id: line.id } : {}),
      productId: Number(line.productId),
      batchId: Number(line.batchId),
      packageId: Number(line.packageId),
      qty: Number(line.qty),
    })),
    productTransportServiceLines: values.productTransportServiceLines.map(
      line => ({
        ...(line.id ? { id: line.id } : {}),
        serviceId: Number(line.serviceId),
        qty: Number(line.qty),
        price: Number(line.price),
      }),
    ),
  };
}

export function validateTransportForm(
  values: TransportFormValues,
): string | null {
  if (
    !values.companyId ||
    !values.warehouseSenderId ||
    !values.warehouseReceiveId
  ) {
    return 'required';
  }

  if (
    !values.productTransportLines.length ||
    values.productTransportLines.some(
      line =>
        !line.productId ||
        !line.batchId ||
        !line.packageId ||
        !line.qty ||
        line.qty <= 0,
    )
  ) {
    return 'productLines';
  }

  if (
    values.productTransportServiceLines.some(
      line =>
        !line.serviceId ||
        !line.qty ||
        line.qty <= 0 ||
        line.price == null ||
        line.price < 0,
    )
  ) {
    return 'serviceLines';
  }

  return null;
}
