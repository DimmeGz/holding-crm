import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderConfirmation } from '../orders-confirmation/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderConfirmation])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
