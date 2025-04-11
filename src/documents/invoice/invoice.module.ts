import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Invoice } from './entities';
import { ShipmentModule } from '../shipment';
import { PaymentModule } from '../payment';

import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { GoodsModule } from '../../goods';
import { WarehouseModule } from '../../warehouse';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    GoodsModule,
    PaymentModule,
    ShipmentModule,
    WarehouseModule,
  ],
  providers: [InvoiceService],
  controllers: [InvoiceController],
  exports: [InvoiceService],
})
export class InvoiceModule {}
