import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CommissionInvoiceService } from './commission-invoice.service';
import { CreateCommissionInvoiceDTO } from './dto';

@Controller('commission')
export class CommissionInvoiceController {
  constructor(
    private readonly commissionInvoiceService: CommissionInvoiceService,
  ) {}

  @Get()
  getCommissionInvoicess() {
    return this.commissionInvoiceService.getCommissionInvoicess();
  }

  @Get(':commissionId')
  getCommissionInvoiceById(@Param('commissionId') commissionId: number) {
    return this.commissionInvoiceService.getCommissionInvoiceById(commissionId);
  }

  @Post()
  createCommissionInvoice(
    @Body()
    createCommissionInvoiceDTO: CreateCommissionInvoiceDTO,
  ) {
    return this.commissionInvoiceService.createCommissionInvoice(
      createCommissionInvoiceDTO,
    );
  }
}
