import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

import { OrdersConfirmationService } from './orders-confirmation.service';

import { OrderConfirmation } from './entities';

import {
  CreateOrderConfirmationDTO,
  UpdateOrderConfirmationDTO,
} from './dto';

@Controller('orders-confirmation')
export class OrdersConfirmationController {
  constructor(
    private readonly ordersConfirmationService: OrdersConfirmationService,
  ) {}

  @Get(':confirmationId')
  getOrderConfirmationById(
    @Param('confirmationId', ParseIntPipe) confirmationId: number,
  ): Promise<OrderConfirmation> {
    return this.ordersConfirmationService.getOrderConfirmationById(
      confirmationId,
    );
  }

  @Post()
  createOrderConfirmation(
    @Body() createOrderConfirmationDTO: CreateOrderConfirmationDTO,
  ): Promise<OrderConfirmation> {
    return this.ordersConfirmationService.createOrderConfirmation(
      createOrderConfirmationDTO,
    );
  }

  @Patch(':confirmationId')
  updateOrderConfirmation(
    @Param('confirmationId', ParseIntPipe) confirmationId: number,
    @Body() updateOrderConfirmationDTO: UpdateOrderConfirmationDTO,
  ): Promise<OrderConfirmation> {
    return this.ordersConfirmationService.updateOrderConfirmation(
      confirmationId,
      updateOrderConfirmationDTO,
    );
  }
}
