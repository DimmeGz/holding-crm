import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';

import { PaymentService } from './payment.service';

import { Payment } from './entities';

import { CreatePaymentDTO, UpdatePaymentDTO } from './dto';
import { BaseDocumentsQueryDTO } from '../common/dto/query-dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getPayments(@Query() query?: BaseDocumentsQueryDTO): Promise<Payment[]> {
    return this.paymentService.getPayments(query);
  }

  @Get(':paymentId')
  @UsePipes(new ParseIntPipe())
  getPaymentById(@Param('paymentId') paymentId: number): Promise<Payment> {
    return this.paymentService.getPaymentById(paymentId);
  }

  @Post()
  createPayment(@Body() createPaymentDTO: CreatePaymentDTO): Promise<Payment> {
    return this.paymentService.createPayment(createPaymentDTO);
  }

  @Patch(':paymentId')
  updatePayment(
    @Param('paymentId', new ParseIntPipe()) paymentId: number,
    @Body() updatePaymentDTO: UpdatePaymentDTO,
  ): Promise<Payment> {
    return this.paymentService.updatePayment(paymentId, updatePaymentDTO);
  }

  @Delete(':paymentId')
  @UsePipes(new ParseIntPipe())
  removePayment(@Param('paymentId') paymentId: number): Promise<Payment> {
    return this.paymentService.removePayment(paymentId);
  }

  @Patch('change-status/:paymentId')
  @UsePipes(new ParseIntPipe())
  changeInvoiceStatus(@Param('paymentId') paymentId: number): Promise<Payment> {
    return this.paymentService.changePaymentStatus(paymentId);
  }
}
