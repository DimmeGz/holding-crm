import type {
  BatchedProductLineFormValue,
  ProductLineFormValue,
  ServiceLineFormValue,
} from '@/types/documents/contracts.types';
import type { InvoiceProductLineFormValue } from '@/types/documents/invoices.types';
import type { OrderProductLineFormValue } from '@/types/documents/orders.types';

export const EMPTY_PRODUCT_LINE: ProductLineFormValue = {
  productId: null,
  packageId: null,
  qty: 1,
  shipQty: 1,
  price: 0,
};

export const EMPTY_BATCHED_PRODUCT_LINE: BatchedProductLineFormValue = {
  productId: null,
  batchId: null,
  packageId: null,
  qty: 1,
  price: 0,
};

export const EMPTY_ORDER_PRODUCT_LINE: OrderProductLineFormValue = {
  productManId: null,
  productBuyId: null,
  packageId: null,
  batchRename: '',
  qty: 1,
  price: 0,
};

export const EMPTY_INVOICE_PRODUCT_LINE: InvoiceProductLineFormValue = {
  orderId: null,
  productId: null,
  batchId: null,
  packageId: null,
  palletsQty: 1,
  qty: 1,
  price: 0,
  cost: null,
  countryOfOriginId: null,
  grossWeight: null,
};

export const EMPTY_SERVICE_LINE: ServiceLineFormValue = {
  serviceId: null,
  qty: 1,
  price: 0,
};
