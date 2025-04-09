import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { PaymentService } from './payment.service';
import { CreatePaymentDTO, UpdatePaymentDTO } from './dto';

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

  @Patch(':paymentId')
  updatePayment(
    @Param('paymentId') paymentId: number,
    @Body() updatePaymentDTO: UpdatePaymentDTO,
  ) {
    return this.paymentService.updatePayment(paymentId, updatePaymentDTO);
  }

  @Delete(':paymentId')
  removePayment(@Param('paymentId') paymentId: number) {
    return this.paymentService.removePayment(paymentId);
  }

  @Patch('change-status/:paymentId')
  changeInvoiceStatus(@Param('paymentId') paymentId: number) {
    return this.paymentService.changePaymentStatus(paymentId);
  }
}
