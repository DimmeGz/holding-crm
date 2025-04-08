import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDTO, UpdateOrderDTO } from './dto';

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

  @Patch('/:orderId')
  updateOrder(
    @Param('orderId') orderId: number,
    @Body() updateOrderDTO: UpdateOrderDTO,
  ) {
    return this.ordersService.updateOrder(orderId, updateOrderDTO);
  }

  @Delete('/:orderId')
  removeOrder(@Param('orderId') orderId: number) {
    return this.ordersService.removeOrder(orderId);
  }

  @Patch('change-status/:orderId')
  changeContractStatus(@Param('orderId') orderId: number) {
    return this.ordersService.changeOrderStatus(orderId);
  }
}
