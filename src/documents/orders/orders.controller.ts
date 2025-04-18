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

import { OrdersService } from './orders.service';
import { CreateOrderDTO, UpdateOrderDTO } from './dto';
import { GetOrdersQueryDTO } from './dto/query-dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders(@Query() query?: GetOrdersQueryDTO) {
    return this.ordersService.getOrders(query);
  }

  @Get('/:orderId')
  @UsePipes(new ParseIntPipe())
  getOrderById(@Param('orderId') orderId: number) {
    return this.ordersService.getOrderById(orderId);
  }

  @Post()
  createOrder(@Body() createOrderDTO: CreateOrderDTO) {
    return this.ordersService.createOrder(createOrderDTO);
  }

  @Patch('/:orderId')
  updateOrder(
    @Param('orderId', new ParseIntPipe()) orderId: number,
    @Body() updateOrderDTO: UpdateOrderDTO,
  ) {
    return this.ordersService.updateOrder(orderId, updateOrderDTO);
  }

  @Delete('/:orderId')
  @UsePipes(new ParseIntPipe())
  removeOrder(@Param('orderId') orderId: number) {
    return this.ordersService.removeOrder(orderId);
  }

  @Patch('change-status/:orderId')
  @UsePipes(new ParseIntPipe())
  changeContractStatus(@Param('orderId') orderId: number) {
    return this.ordersService.changeOrderStatus(orderId);
  }
}
