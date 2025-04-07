import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get('/:orderId')
  getOrderById(@Param('orderId') orderId: number) {
    return this.ordersService.getOrderById(orderId);
  }

  @Post()
  createOrder(@Body() createOrderDTO: CreateOrderDTO) {
    return this.ordersService.createOrder(createOrderDTO);
  }
}
