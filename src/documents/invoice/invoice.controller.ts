import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';

import { InvoiceService } from './invoice.service';

import { Invoice } from './entities';

import {
  CreateInvoiceByContractDTO,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
} from './dto';
import { GetInvoicesQueryDTO } from './dto/query-dto';
import { GetInvoiceResponseDTO } from './dto/response-dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  getInvoices(@Query() query?: GetInvoicesQueryDTO): Promise<Invoice[]> {
    return this.invoiceService.getInvoices(query);
  }

  @Get(':invoiceId')
  @UsePipes(new ParseIntPipe())
  getInvoiceById(
    @Param('invoiceId') invoiceId: number,
  ): Promise<GetInvoiceResponseDTO> {
    return this.invoiceService.getInvoiceById(invoiceId);
  }

  @Post()
  createInvoice(@Body() createInvoiceDTO: CreateInvoiceDTO): Promise<Invoice> {
    return this.invoiceService.createInvoice(createInvoiceDTO);
  }

  @Post('by-contract')
  createInvoiceByContract(
    @Body() createInvoiceByContractDTO: CreateInvoiceByContractDTO,
  ): Promise<Invoice> {
    return this.invoiceService.createInvoiceByContract(
      createInvoiceByContractDTO,
    );
  }

  @Patch(':invoiceId')
  updateInvoice(
    @Param('invoiceId', new ParseIntPipe()) invoiceId: number,
    @Body() updateInvoiceDTO: UpdateInvoiceDTO,
  ): Promise<Invoice> {
    return this.invoiceService.updateInvoice(invoiceId, updateInvoiceDTO);
  }

  @Delete(':invoiceId')
  @UsePipes(new ParseIntPipe())
  removeInvoice(@Param('invoiceId') invoiceId: number): Promise<Invoice> {
    return this.invoiceService.removeInvoice(invoiceId);
  }

  @Patch('change-status/:invoiceId')
  @UsePipes(new ParseIntPipe())
  changeInvoiceStatus(@Param('invoiceId') invoiceId: number): Promise<Invoice> {
    return this.invoiceService.changeInvoiceStatus(invoiceId);
  }
}
