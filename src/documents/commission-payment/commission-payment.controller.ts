import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CommissionPaymentService } from './commission-payment.service';

import { CreateCommissionPaymentDTO, UpdateCommissionPaymentDTO } from './dto';

@Controller('commission_payment')
export class CommissionPaymentController {
  constructor(
    private readonly commissionPaymentService: CommissionPaymentService,
  ) {}

  @Get()
  getCommisionPayments() {
    return this.commissionPaymentService.getCommisionPayments();
  }

  @Get(':commissionPaymentId')
  getCommisionPaymentById(
    @Param('commissionPaymentId') commissionPaymentId: number,
  ) {
    return this.commissionPaymentService.getCommisionPaymentById(
      commissionPaymentId,
    );
  }

  @Post()
  createCommissionPayment(
    @Body()
    createCommissionPaymentDTO: CreateCommissionPaymentDTO,
  ) {
    return this.commissionPaymentService.createCommissionPayment(
      createCommissionPaymentDTO,
    );
  }

  @Patch(':commissionPaymentId')
  updateCommissionPayment(
    @Param('commissionPaymentId') commissionPaymentId: number,
    @Body() updateCommissionPaymentDTO: UpdateCommissionPaymentDTO,
  ) {
    return this.commissionPaymentService.updateCommissionPayment(
      commissionPaymentId,
      updateCommissionPaymentDTO,
    );
  }

  @Delete(':commissionPaymentId')
  removeCommissionPayment(
    @Param('commissionPaymentId') commissionPaymentId: number,
  ) {
    return this.commissionPaymentService.removeCommissionPayment(
      commissionPaymentId,
    );
  }

  @Patch('change-status/:commissionPaymentId')
  changeCommissionPaymentStatus(
    @Param('commissionPaymentId') commissionPaymentId: number,
  ) {
    return this.commissionPaymentService.changeCommissionPaymentStatus(
      commissionPaymentId,
    );
  }
}
