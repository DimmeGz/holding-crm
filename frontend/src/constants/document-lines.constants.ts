import type {
  ProductLineFormValue,
  ServiceLineFormValue,
} from '@/types/documents/contracts.types';

export const EMPTY_PRODUCT_LINE: ProductLineFormValue = {
  productId: null,
  packageId: null,
  qty: 1,
  shipQty: 1,
  price: 0,
};

export const EMPTY_SERVICE_LINE: ServiceLineFormValue = {
  serviceId: null,
  qty: 1,
  price: 0,
};
