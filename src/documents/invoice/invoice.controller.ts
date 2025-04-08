import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { InvoiceService } from './invoice.service';
import { CreateInvoiceDTO } from './dto';

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

  @Post()
  createInvoice(@Body() createInvoiceDTO: CreateInvoiceDTO) {
    return this.invoiceService.createInvoice(createInvoiceDTO);
  }
}
