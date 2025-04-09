import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { PaymentService } from './payment.service';
import { CreatePaymentDTO } from './dto';

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

  @Post()
  createPayment(@Body() createPaymentDTO: CreatePaymentDTO) {
    return this.paymentService.createPayment(createPaymentDTO);
  }
}
