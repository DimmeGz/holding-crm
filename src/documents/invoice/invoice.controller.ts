import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { InvoiceService } from './invoice.service';
import { CreateInvoiceDTO, UpdateInvoiceDTO } from './dto';

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

  @Patch(':invoiceId')
  updateInvoice(
    @Param('invoiceId') invoiceId: number,
    @Body() updateInvoiceDTO: UpdateInvoiceDTO,
  ) {
    return this.invoiceService.updateInvoice(invoiceId, updateInvoiceDTO);
  }
}
