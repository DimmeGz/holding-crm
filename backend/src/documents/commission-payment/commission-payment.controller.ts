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

import { CommissionPaymentService } from './commission-payment.service';

import { CreateCommissionPaymentDTO, UpdateCommissionPaymentDTO } from './dto';
import { CommissionPayment } from './entities';

@Controller('commission-payments')
export class CommissionPaymentController {
  constructor(
    private readonly commissionPaymentService: CommissionPaymentService,
  ) {}

  @Get()
  getCommisionPayments(): Promise<CommissionPayment[]> {
    return this.commissionPaymentService.getCommisionPayments();
  }

  @Get(':commissionPaymentId')
  @UsePipes(new ParseIntPipe())
  getCommisionPaymentById(
    @Param('commissionPaymentId') commissionPaymentId: number,
  ): Promise<CommissionPayment> {
    return this.commissionPaymentService.getCommisionPaymentById(
      commissionPaymentId,
    );
  }

  @Post()
  createCommissionPayment(
    @Body()
    createCommissionPaymentDTO: CreateCommissionPaymentDTO,
  ): Promise<CommissionPayment> {
    return this.commissionPaymentService.createCommissionPayment(
      createCommissionPaymentDTO,
    );
  }

  @Patch(':commissionPaymentId')
  updateCommissionPayment(
    @Param('commissionPaymentId', new ParseIntPipe())
    commissionPaymentId: number,
    @Body() updateCommissionPaymentDTO: UpdateCommissionPaymentDTO,
  ): Promise<CommissionPayment> {
    return this.commissionPaymentService.updateCommissionPayment(
      commissionPaymentId,
      updateCommissionPaymentDTO,
    );
  }

  @Delete(':commissionPaymentId')
  @UsePipes(new ParseIntPipe())
  removeCommissionPayment(
    @Param('commissionPaymentId') commissionPaymentId: number,
  ): Promise<CommissionPayment> {
    return this.commissionPaymentService.removeCommissionPayment(
      commissionPaymentId,
    );
  }

  @Patch('change-status/:commissionPaymentId')
  @UsePipes(new ParseIntPipe())
  changeCommissionPaymentStatus(
    @Param('commissionPaymentId') commissionPaymentId: number,
  ): Promise<CommissionPayment> {
    return this.commissionPaymentService.changeCommissionPaymentStatus(
      commissionPaymentId,
    );
  }
}
