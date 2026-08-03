export type CalendarCompanyRef = {
  id: number;
  name: string;
};

export type CalendarOrder = {
  id: number;
  orderNumber: string;
  displayDate: string;
  status: boolean;
  hasInvoices: boolean;
  seller: CalendarCompanyRef;
  buyer: CalendarCompanyRef;
  calendarHex: string | null;
  productSummary: string;
  tooltipLines: string[];
  isAsap: boolean;
};

export type CalendarQuery = {
  year: number;
  month: number;
  process?: number[];
  type?: 'sel' | 'buy';
};
