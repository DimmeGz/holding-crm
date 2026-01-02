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

import { Order } from './entities';

import { CreateOrderDTO, UpdateOrderDTO } from './dto';
import { GetOrdersQueryDTO } from './dto/query-dto';
import { GetOrderResponseDTO } from './dto/respone-dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders(@Query() query?: GetOrdersQueryDTO): Promise<Order[]> {
    return this.ordersService.getOrders(query);
  }

  @Get('/:orderId')
  @UsePipes(new ParseIntPipe())
  getOrderById(
    @Param('orderId') orderId: number,
  ): Promise<GetOrderResponseDTO> {
    return this.ordersService.getOrderById(orderId);
  }

  @Post()
  createOrder(@Body() createOrderDTO: CreateOrderDTO): Promise<Order> {
    return this.ordersService.createOrder(createOrderDTO);
  }

  @Patch('/:orderId')
  updateOrder(
    @Param('orderId', new ParseIntPipe()) orderId: number,
    @Body() updateOrderDTO: UpdateOrderDTO,
  ): Promise<Order> {
    return this.ordersService.updateOrder(orderId, updateOrderDTO);
  }

  @Delete('/:orderId')
  @UsePipes(new ParseIntPipe())
  removeOrder(@Param('orderId') orderId: number): Promise<Order> {
    return this.ordersService.removeOrder(orderId);
  }

  @Patch('change-status/:orderId')
  @UsePipes(new ParseIntPipe())
  changeContractStatus(@Param('orderId') orderId: number): Promise<Order> {
    return this.ordersService.changeOrderStatus(orderId);
  }
}
