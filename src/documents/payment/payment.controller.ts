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
import { CreatePaymentDTO, UpdatePaymentDTO } from './dto';
import { BaseDocumentsQueryDTO } from '../common/dto/query-dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getPayments(@Query() query?: BaseDocumentsQueryDTO) {
    return this.paymentService.getPayments(query);
  }

  @Get(':paymentId')
  @UsePipes(new ParseIntPipe())
  getPaymentById(@Param('paymentId') paymentId: number) {
    return this.paymentService.getPaymentById(paymentId);
  }

  @Post()
  createPayment(@Body() createPaymentDTO: CreatePaymentDTO) {
    return this.paymentService.createPayment(createPaymentDTO);
  }

  @Patch(':paymentId')
  updatePayment(
    @Param('paymentId', new ParseIntPipe()) paymentId: number,
    @Body() updatePaymentDTO: UpdatePaymentDTO,
  ) {
    return this.paymentService.updatePayment(paymentId, updatePaymentDTO);
  }

  @Delete(':paymentId')
  @UsePipes(new ParseIntPipe())
  removePayment(@Param('paymentId') paymentId: number) {
    return this.paymentService.removePayment(paymentId);
  }

  @Patch('change-status/:paymentId')
  @UsePipes(new ParseIntPipe())
  changeInvoiceStatus(@Param('paymentId') paymentId: number) {
    return this.paymentService.changePaymentStatus(paymentId);
  }
}
