import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GoodsModule } from '../../goods';
import { Order } from '../orders/entities';

import { OrderConfirmation, OrderConfirmationLine } from './entities';
import { OrdersConfirmationService } from './orders-confirmation.service';
import { OrdersConfirmationController } from './orders-confirmation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderConfirmation,
      OrderConfirmationLine,
      Order,
    ]),
    GoodsModule,
  ],
  providers: [OrdersConfirmationService],
  exports: [OrdersConfirmationService],
  controllers: [OrdersConfirmationController],
})
export class OrdersConfirmationModule {}
