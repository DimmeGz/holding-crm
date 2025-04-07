import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { InvoiceModule } from '../invoice';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), InvoiceModule],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
