import { Controller, Get, Param } from '@nestjs/common';

import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getPayments() {
    return this.paymentService.getPayments();
  }

  @Get(':paymentId')
  getPaymentById(@Param('paymentId') paymentId: number) {
    return this.paymentService.getPaymentById(paymentId);
  }
}
