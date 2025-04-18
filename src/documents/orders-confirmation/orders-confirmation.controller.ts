import { Body, Controller, Post } from '@nestjs/common';

import { OrdersConfirmationService } from './orders-confirmation.service';
import { CreateOrderConfirmationDTO } from './dto';

@Controller('orders-confirmation')
export class OrdersConfirmationController {
  constructor(
    private readonly ordersConfirmationService: OrdersConfirmationService,
  ) {}

  @Post()
  createOrderConfirmation(
    @Body() createOrderConfirmationDTO: CreateOrderConfirmationDTO,
  ) {
    return this.ordersConfirmationService.createOrderConfirmation(
      createOrderConfirmationDTO,
    );
  }
}
