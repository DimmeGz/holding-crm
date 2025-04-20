import { Body, Controller, Post } from '@nestjs/common';

import { OrdersConfirmationService } from './orders-confirmation.service';

import { OrderConfirmation } from './entities';

import { CreateOrderConfirmationDTO } from './dto';

@Controller('orders-confirmation')
export class OrdersConfirmationController {
  constructor(
    private readonly ordersConfirmationService: OrdersConfirmationService,
  ) {}

  @Post()
  createOrderConfirmation(
    @Body() createOrderConfirmationDTO: CreateOrderConfirmationDTO,
  ): Promise<OrderConfirmation> {
    return this.ordersConfirmationService.createOrderConfirmation(
      createOrderConfirmationDTO,
    );
  }
}
