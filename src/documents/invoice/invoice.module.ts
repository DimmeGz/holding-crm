import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '../../companies';
import { GoodsModule } from '../../goods';
import { ShipmentModule } from '../shipment';
import { OrdersModule } from '../orders';
import { PaymentModule } from '../payment';
import { WarehouseModule } from '../../warehouse';

import { Invoice } from './entities';

import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    CompaniesModule,
    GoodsModule,
    PaymentModule,
    ShipmentModule,
    WarehouseModule,
    forwardRef(() => OrdersModule),
  ],
  providers: [InvoiceService],
  controllers: [InvoiceController],
  exports: [InvoiceService],
})
export class InvoiceModule {}
