import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { ContractsModule } from '../contracts';
import { GoodsModule } from '../../goods';
import { InvoiceModule } from '../invoice';
import { OrdersConfirmationModule } from '../orders-confirmation';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    GoodsModule,
    OrdersConfirmationModule,
    forwardRef(() => ContractsModule),
    forwardRef(() => InvoiceModule),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
