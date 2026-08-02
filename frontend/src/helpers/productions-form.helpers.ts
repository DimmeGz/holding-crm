import { EMPTY_BATCHED_PRODUCT_LINE } from '@/constants/document-lines.constants';
import type {
  CreateProductionPayload,
  Production,
  ProductionFormValues,
  UpdateProductionPayload,
} from '@/types/documents/productions.types';

export function createEmptyProductionFormValues(): ProductionFormValues {
  return {
    companyId: null,
    warehouseId: null,
    expectedDate: new Date(),
    comment: '',
    productionOutLines: [{ ...EMPTY_BATCHED_PRODUCT_LINE }],
    productionInLines: [{ ...EMPTY_BATCHED_PRODUCT_LINE }],
  };
}

export function productionToFormValues(
  production: Production,
): ProductionFormValues {
  return {
    companyId: String(production.companyId),
    warehouseId: String(production.warehouseId),
    expectedDate: production.expectedDate
      ? new Date(production.expectedDate)
      : null,
    comment: production.comment ?? '',
    productionOutLines: (production.productionOutLines ?? []).map(line => ({
      id: line.id,
      productId: String(line.productId),
      batchId: String(line.batchId),
      packageId: String(line.packageId),
      qty: Number(line.qty) || 0,
      price: Number(line.cost) || 0,
    })),
    productionInLines: (production.productionInLines ?? []).map(line => ({
      id: line.id,
      productId: String(line.productId),
      batchId: String(line.batchId),
      packageId: String(line.packageId),
      qty: Number(line.qty) || 0,
      price: 0,
    })),
  };
}

function toCost(price: number): number {
  return Number(Number(price).toFixed(2));
}

export function formValuesToCreatePayload(
  values: ProductionFormValues,
): CreateProductionPayload {
  return {
    companyId: Number(values.companyId),
    warehouseId: Number(values.warehouseId),
    expectedDate: values.expectedDate ?? undefined,
    comment: values.comment || undefined,
    productionOutLines: values.productionOutLines.map(line => ({
      productId: Number(line.productId),
      batchId: Number(line.batchId),
      packageId: Number(line.packageId),
      qty: Number(line.qty),
      cost: toCost(line.price),
    })),
    productionInLines: values.productionInLines.map(line => ({
      productId: Number(line.productId),
      batchId: Number(line.batchId),
      packageId: Number(line.packageId),
      qty: Number(line.qty),
    })),
  };
}

export function formValuesToUpdatePayload(
  values: ProductionFormValues,
): UpdateProductionPayload {
  return {
    companyId: Number(values.companyId),
    warehouseId: Number(values.warehouseId),
    expectedDate: values.expectedDate ?? undefined,
    comment: values.comment || undefined,
    productionOutLines: values.productionOutLines.map(line => ({
      ...(line.id ? { id: line.id } : {}),
      productId: Number(line.productId),
      batchId: Number(line.batchId),
      packageId: Number(line.packageId),
      qty: Number(line.qty),
      cost: toCost(line.price),
    })),
    productionInLines: values.productionInLines.map(line => ({
      ...(line.id ? { id: line.id } : {}),
      productId: Number(line.productId),
      batchId: Number(line.batchId),
      packageId: Number(line.packageId),
      qty: Number(line.qty),
    })),
  };
}

export function validateProductionForm(
  values: ProductionFormValues,
): 'required' | 'productionOutLines' | 'productionInLines' | null {
  if (!values.companyId || !values.warehouseId) {
    return 'required';
  }

  if (
    !values.productionOutLines.length ||
    values.productionOutLines.some(
      line =>
        !line.productId ||
        !line.batchId ||
        !line.packageId ||
        !line.qty ||
        line.qty <= 0 ||
        !line.price ||
        line.price <= 0,
    )
  ) {
    return 'productionOutLines';
  }

  if (
    !values.productionInLines.length ||
    values.productionInLines.some(
      line =>
        !line.productId ||
        !line.batchId ||
        !line.packageId ||
        !line.qty ||
        line.qty <= 0,
    )
  ) {
    return 'productionInLines';
  }

  return null;
}
