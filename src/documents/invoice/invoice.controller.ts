import { Controller, Get, Param } from '@nestjs/common';

import { InvoiceService } from './invoice.service';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  getInvoices() {
    return this.invoiceService.getInvoices();
  }

  @Get(':invoiceId')
  getInvoiceById(@Param('invoiceId') invoiceId: number) {
    return this.invoiceService.getInvoiceById(invoiceId);
  }
}
