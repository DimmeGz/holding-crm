import { Controller, Get, Param } from '@nestjs/common';
import { CommissionPaymentService } from './commission-payment.service';

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
}
