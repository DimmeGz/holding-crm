import type {
  Contract,
  ContractFormValues,
  CreateContractPayload,
  ProductLineFormValue,
  ServiceLineFormValue,
  UpdateContractPayload,
} from '@/types/documents/contracts.types';
import { EMPTY_PRODUCT_LINE } from '@/constants/document-lines.constants';
import { findRecordIdByName } from '@/helpers/select.helpers';

export function createEmptyContractFormValues(
  defaultCurrencyId?: number,
): ContractFormValues {
  return {
    name: '',
    sellerId: null,
    buyerId: null,
    currencyId: defaultCurrencyId ? String(defaultCurrencyId) : null,
    signatureDate: new Date(),
    term: null,
    vat: 0,
    paymentDelay: 0,
    incotermsId: null,
    transportPlace: '',
    orderPrefix: '',
    comment: '',
    parentId: null,
    contractLines: [{ ...EMPTY_PRODUCT_LINE }],
    contractServiceLines: [],
  };
}

export function contractToFormValues(contract: Contract): ContractFormValues {
  return {
    name: contract.name,
    sellerId: String(contract.sellerId),
    buyerId: String(contract.buyerId),
    currencyId: String(contract.currencyId),
    signatureDate: contract.signatureDate
      ? new Date(contract.signatureDate)
      : new Date(),
    term: contract.term ? new Date(contract.term) : null,
    vat: contract.vat ?? 0,
    paymentDelay: contract.paymentDelay ?? 0,
    incotermsId: contract.incotermsId ? String(contract.incotermsId) : null,
    transportPlace: contract.transportPlace ?? '',
    orderPrefix: contract.orderPrefix ?? '',
    comment: contract.comment ?? '',
    parentId: contract.parentId ? String(contract.parentId) : null,
    contractLines: contract.contractLines.map(line => ({
      id: line.id,
      productId: String(line.productId),
      packageId: String(line.packageId),
      qty: line.qty,
      shipQty: line.shipQty,
      price: line.price,
    })),
    contractServiceLines: (contract.contractServiceLines ?? []).map(line => ({
      id: line.id,
      serviceId: String(line.serviceId),
      qty: line.qty,
      price: line.price,
    })),
  };
}

function filterProductLines(
  lines: ProductLineFormValue[],
): ProductLineFormValue[] {
  return lines.filter(line => line.productId && line.packageId);
}

function filterServiceLines(
  lines: ServiceLineFormValue[],
): ServiceLineFormValue[] {
  return lines.filter(line => line.serviceId);
}

function mapProductLines(lines: ProductLineFormValue[]) {
  return filterProductLines(lines).map(line => ({
    ...(line.id ? { id: line.id } : {}),
    productId: Number(line.productId),
    packageId: Number(line.packageId),
    qty: line.qty,
    shipQty: line.shipQty,
    price: line.price,
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

function mapHeaderFields(values: ContractFormValues) {
  return {
    name: values.name,
    sellerId: Number(values.sellerId),
    buyerId: Number(values.buyerId),
    currencyId: Number(values.currencyId),
    signatureDate: values.signatureDate ?? undefined,
    term: values.term ?? null,
    vat: values.vat,
    paymentDelay: values.paymentDelay,
    incotermsId: values.incotermsId ? Number(values.incotermsId) : null,
    transportPlace: values.transportPlace || undefined,
    orderPrefix: values.orderPrefix || undefined,
    comment: values.comment || undefined,
    parentId: values.parentId ? Number(values.parentId) : null,
  };
}

export function formValuesToCreatePayload(
  values: ContractFormValues,
): CreateContractPayload {
  return {
    ...mapHeaderFields(values),
    contractLines: mapProductLines(values.contractLines),
    contractServiceLines: mapServiceLines(values.contractServiceLines),
  };
}

export function formValuesToUpdatePayload(
  values: ContractFormValues,
): UpdateContractPayload {
  return {
    ...mapHeaderFields(values),
    contractLines: mapProductLines(values.contractLines),
    contractServiceLines: mapServiceLines(values.contractServiceLines),
  };
}

export function getDefaultEurCurrencyId(
  currencies: Record<number, string>,
): number | undefined {
  return findRecordIdByName(currencies, 'EUR');
}

export function validateContractForm(values: ContractFormValues): string | null {
  if (!values.name.trim()) {
    return 'name';
  }

  if (!values.sellerId || !values.buyerId || !values.currencyId) {
    return 'required';
  }

  if (filterProductLines(values.contractLines).length === 0) {
    return 'productLines';
  }

  return null;
}
