import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { InvoiceService } from './invoice.service';
import {
  CreateInvoiceByContractDTO,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
} from './dto';
import { GetInvoicesQueryDTO } from './dto/query-dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  getInvoices(@Query() query?: GetInvoicesQueryDTO) {
    return this.invoiceService.getInvoices(query);
  }

  @Get(':invoiceId')
  getInvoiceById(@Param('invoiceId') invoiceId: number) {
    return this.invoiceService.getInvoiceById(invoiceId);
  }

  @Post()
  createInvoice(@Body() createInvoiceDTO: CreateInvoiceDTO) {
    return this.invoiceService.createInvoice(createInvoiceDTO);
  }

  @Post('by-contract')
  createInvoiceByContract(
    @Body() createInvoiceByContractDTO: CreateInvoiceByContractDTO,
  ) {
    return this.invoiceService.createInvoiceByContract(
      createInvoiceByContractDTO,
    );
  }

  @Patch(':invoiceId')
  updateInvoice(
    @Param('invoiceId') invoiceId: number,
    @Body() updateInvoiceDTO: UpdateInvoiceDTO,
  ) {
    return this.invoiceService.updateInvoice(invoiceId, updateInvoiceDTO);
  }

  @Delete(':invoiceId')
  removeInvoice(@Param('invoiceId') invoiceId: number) {
    return this.invoiceService.removeInvoice(invoiceId);
  }

  @Patch('change-status/:invoiceId')
  changeInvoiceStatus(@Param('invoiceId') invoiceId: number) {
    return this.invoiceService.changeInvoiceStatus(invoiceId);
  }
}
