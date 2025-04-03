import { Controller, Get } from '@nestjs/common';
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
}
