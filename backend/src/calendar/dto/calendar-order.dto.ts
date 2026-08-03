export class CalendarCompanyRefDTO {
  id: number;
  name: string;
}

export class CalendarOrderDTO {
  id: number;
  orderNumber: string;
  displayDate: string;
  status: boolean;
  hasInvoices: boolean;
  seller: CalendarCompanyRefDTO;
  buyer: CalendarCompanyRefDTO;
  calendarHex: string | null;
  productSummary: string;
  tooltipLines: string[];
  isAsap: boolean;
}
