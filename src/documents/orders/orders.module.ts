import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { InvoiceModule } from '../invoice';
import { GoodsModule } from '../../goods';
import { OrdersConfirmationModule } from '../orders-confirmation';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    GoodsModule,
    OrdersConfirmationModule,
    forwardRef(() => InvoiceModule),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
