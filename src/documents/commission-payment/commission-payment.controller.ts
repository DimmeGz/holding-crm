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
  @UsePipes(new ParseIntPipe())
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
    @Param('commissionPaymentId', new ParseIntPipe())
    commissionPaymentId: number,
    @Body() updateCommissionPaymentDTO: UpdateCommissionPaymentDTO,
  ) {
    return this.commissionPaymentService.updateCommissionPayment(
      commissionPaymentId,
      updateCommissionPaymentDTO,
    );
  }

  @Delete(':commissionPaymentId')
  @UsePipes(new ParseIntPipe())
  removeCommissionPayment(
    @Param('commissionPaymentId') commissionPaymentId: number,
  ) {
    return this.commissionPaymentService.removeCommissionPayment(
      commissionPaymentId,
    );
  }

  @Patch('change-status/:commissionPaymentId')
  @UsePipes(new ParseIntPipe())
  changeCommissionPaymentStatus(
    @Param('commissionPaymentId') commissionPaymentId: number,
  ) {
    return this.commissionPaymentService.changeCommissionPaymentStatus(
      commissionPaymentId,
    );
  }
}
