import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CommissionInvoiceService } from './commission-invoice.service';
import { CreateCommissionInvoiceDTO, UpdateCommissionInvoiceDTO } from './dto';

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

  @Patch(':commissionId')
  updateCommissionInvoice(
    @Param('commissionId') commissionId: number,
    @Body()
    updateCommissionInvoiceDTO: UpdateCommissionInvoiceDTO,
  ) {
    return this.commissionInvoiceService.updateCommissionInvoice(
      commissionId,
      updateCommissionInvoiceDTO,
    );
  }

  @Delete(':commissionId')
  removeCommission(@Param('commissionId') commissionId: number) {
    return this.commissionInvoiceService.removeCommission(commissionId);
  }

  @Patch('change-status/:commissionId')
  changeCommissionStatus(@Param('commissionId') commissionId: number) {
    return this.commissionInvoiceService.changeCommissionStatus(commissionId);
  }
}
