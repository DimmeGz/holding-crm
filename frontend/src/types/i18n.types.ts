export type I18nResources = {
  uk: LocaleDict;
  cz: LocaleDict;
};

export type LocaleDict = {
  common: {
    nav: {
      companies: string;
      warehouse: string;
      calendar: string;
      transit: string;
      contracts: string;
      orders: string;
      invoices: string;
      payments: string;
      commissionInvoices: string;
      commissioPayments: string;
      shipments: string;
      receives: string;
      production: string;
      transportations: string;
      batchEdit: string;
    };
    actions: {
      create: string;
      edit: string;
      delete: string;
      save: string;
      cancel: string;
    };
    messages: {
      error: string;
      noData: string;
    };
  };
  tables: {
    columns: {
      orderNumber: string;
      seller: string;
      buyer: string;
      recipient: string;
      expectedDate: string;
      confirmDate: string;
      amount: string;
      byContract: string;
      status: string;
      goods: string;
      productMan: string;
      productBuy: string;
      batchRename: string;
      package: string;
      qty: string;
      price: string;
    };
  };
  documents: {
    documents: {
      order: string;
      confirm: string;
      byContract: string;
      createdAt: string;
      mainInfo: string;
      seller: string;
      buyer: string;
      recipient: string;
      warehouse: string;
      payDelivery: string;
      expectedDate: string;
      vat: string;
      paymentDelay: string;
      incoterms: string;
      days: string;
      goods: string;
    };
  };
};
