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
    common: {
      kg: string;
      days: string;
    };
  };
  tables: {
    columns: {
      orderNumber: string;
      seller: string;
      buyer: string;
      payer: string;
      recipient: string;
      expectedDate: string;
      paymentDate: string;
      signatureDate: string;
      confirmDate: string;
      expirationDate: string;
      amount: string;
      byContract: string;
      status: string;
      goods: string;
      product: string;
      productMan: string;
      productBuy: string;
      batch: string;
      batchRename: string;
      package: string;
      qty: string;
      shipLeft: string;
      shipQty: string;
      price: string;
      name: string;
      cost: string;
      palletsQty: string;
      countryOfOrigin: string;
      byOrder: string;
      byInvoice: string;
    };
    showArchived: string;
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
      perpetual: string;
      valid: string;
      closed: string;
      contract: string;
      orderPrefix: string;
      relatedDocuments: string;
      invoice: string;
      shipment: string;
      receive: string;
      payment: string;
      byInvoice: string;
      payed: string;
      invoiced: string;
      paymentBalance: string;
      grossWeight: string;
      transportAmount: string;
      ordersSeparation: string;
      reportPeriod: string;
      additionalInfo: string;
    };
  };
};
