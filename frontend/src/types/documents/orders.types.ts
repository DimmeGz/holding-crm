export type GetOrdersDto = {
  id: number;
  orderNumber: string;
  documentSum: number;
  sellerId: number;
  buyerId: number;
  recipientId: number;
  currencyId: number;
  contract: {
    createdById: number;
    name: string;
  };
  orderProducts: string[];
  expectedDate?: Date;
  confirmExpectedDate?: Date;
  status: boolean;
};

export type GetOrderDto = {
  order: Order;
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

export type Order = {
  id: number;
  status: boolean;
  orderNumber: string;
  seller: { name: string };
  sellerWarehouse: { name: string };
  buyer: { name: string };
  buyerWarehouse: { name: string };
  recipient?: { name: string };
  recipientWarehouse?: { name: string };
  createdAt: Date;
  expectedDate: Date;
  vat: number;
  currency: { name: string };
  paymentDelay: number;
  incoterms: string;
  contract: {
    id: number;
    name: string;
  };
  confirmation?: Confirmation;
  orderLines: OrderLine[];
};

export type OrderLine = {
  qty: number;
  price: number;
  batchRename?: string;
  productMan: {
    name: string;
  };
  productBuy: {
    name: string;
  };
  package: {
    name: string;
  };
};

type Confirmation = {
  confirmationNumber: string;
  createdAt: Date;
  buyerWarehouse: { name: string };
  recipient?: { name: string };
  recipientWarehouse?: { name: string };
  paymentDelay: number;
  incoterms: string;
  expectedDate: Date;
  orderLines: OrderLine[];
};
