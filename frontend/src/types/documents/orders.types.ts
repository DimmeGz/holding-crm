import type { GetCompanyDto } from '@/types/common.types';

export type GetOrdersDto = {
  id: number;
  orderNumber: string;
  documentSum: number;
  seller: GetCompanyDto;
  buyer: GetCompanyDto;
  recipient: GetCompanyDto;
  contract: {
    createdById: number;
    name: string;
  };
  orderProducts: string[];
  expectedDate?: Date;
  confirmExpectedDate?: Date;
  currency: {
    id: number;
    name: string;
  };
  status: boolean;
};

export type GetOrderDto = {
  order: {
    createdById: number;
    id: number;
    sellerId: number;
    buyerId: number;
    currencyId: number;
    comment: string;
    status: boolean;
    createdAt: Date;
    sellerWarehouseId: number;
    buyerWarehouseId: number;
    recipientWarehouseId: number;
    paymentDelay: number;
    signatureDate: Date;
    vat: number;
    documentSum: number;
    carPlate?: string;
    orderNumber: string;
    expectedDate: Date;
    confirmExpectedDate: Date;
    sortingDate: Date;
    isDateAsap: boolean;
    contractId: number;
    incotermsId: number;
    transportPlace: string;
    isHidden: boolean;
    confirmation?: {
      createdById: number;
      id: number;
      sellerId: number;
      buyerId: number;
      currencyId: number;
      comment: string;
      createdAt: Date;
      sellerWarehouseId: number;
      buyerWarehouseId: number;
      recipientId: number;
      recipientWarehouseId: number;
      paymentDelay: number;
      orderId: number;
      confirmationNumber: string;
      expectedDate: Date;
      incotermsId: number;
      transportPlace: string;
    };
  };
  invoices: {
    createdById: number;
    id: number;
    status: boolean;
    invoiceNumber: string;
    invoiceLines: {
      id: string;
      qty: number;
      price: number;
      packageId: number;
      cost: number;
      productId: number;
      batchId: number;
      countryOfOriginId: number;
      orderId: number;
      palletsQty: number;
      grossWeight: number;
    }[];
    shipments: [
      {
        createdById: number;
        id: number;
        status: boolean;
        receives: {
          createdById: number;
          id: number;
          status: boolean;
        }[];
      },
    ];
    payments: {
      createdById: number;
      id: number;
      status: boolean;
    }[];
  }[];
  orderConfirmations: {
    createdById: number;
    id: number;
    confirmationNumber: string;
  }[];
};
