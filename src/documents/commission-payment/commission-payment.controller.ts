import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommissionPaymentService } from './commission-payment.service';
import { CreateCommissionPaymentDTO } from './dto';

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
}
