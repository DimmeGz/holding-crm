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
      shippings: string;
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
};
