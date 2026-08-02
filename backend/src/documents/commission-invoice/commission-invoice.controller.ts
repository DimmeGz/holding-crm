import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';

import { CommissionInvoiceService } from './commission-invoice.service';
import { CreateCommissionInvoiceDTO, UpdateCommissionInvoiceDTO } from './dto';
import { CommissionInvoice } from './entities';

@Controller('commissions')
export class CommissionInvoiceController {
  constructor(
    private readonly commissionInvoiceService: CommissionInvoiceService,
  ) {}

  @Get()
  getCommissionInvoicess(): Promise<CommissionInvoice[]> {
    return this.commissionInvoiceService.getCommissionInvoices();
  }

  @Get(':commissionId')
  @UsePipes(new ParseIntPipe())
  getCommissionInvoiceById(
    @Param('commissionId') commissionId: number,
  ): Promise<CommissionInvoice> {
    return this.commissionInvoiceService.getCommissionInvoiceById(commissionId);
  }

  @Post()
  createCommissionInvoice(
    @Body()
    createCommissionInvoiceDTO: CreateCommissionInvoiceDTO,
  ): Promise<CommissionInvoice> {
    return this.commissionInvoiceService.createCommissionInvoice(
      createCommissionInvoiceDTO,
    );
  }

  @Patch('change-status/:commissionId')
  @UsePipes(new ParseIntPipe())
  changeCommissionStatus(
    @Param('commissionId') commissionId: number,
  ): Promise<CommissionInvoice> {
    return this.commissionInvoiceService.changeCommissionStatus(commissionId);
  }

  @Patch(':commissionId')
  updateCommissionInvoice(
    @Param('commissionId', new ParseIntPipe()) commissionId: number,
    @Body()
    updateCommissionInvoiceDTO: UpdateCommissionInvoiceDTO,
  ): Promise<CommissionInvoice> {
    return this.commissionInvoiceService.updateCommissionInvoice(
      commissionId,
      updateCommissionInvoiceDTO,
    );
  }

  @Delete(':commissionId')
  @UsePipes(new ParseIntPipe())
  removeCommission(
    @Param('commissionId') commissionId: number,
  ): Promise<CommissionInvoice> {
    return this.commissionInvoiceService.removeCommission(commissionId);
  }
}
