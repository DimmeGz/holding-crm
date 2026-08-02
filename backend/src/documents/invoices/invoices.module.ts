import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '../../companies';
import { GoodsModule } from '../../goods';
import { ReceiveModule } from '../receive';
import { ShipmentModule } from '../shipment';
import { OrdersModule } from '../orders';
import { PaymentModule } from '../payment';
import { WarehouseModule } from '../../warehouse';

import { Invoice } from './entities';

import { InvoiceService } from './invoices.service';
import { InvoiceController } from './invoices.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    CompaniesModule,
    GoodsModule,
    forwardRef(() => PaymentModule),
    ShipmentModule,
    ReceiveModule,
    WarehouseModule,
    forwardRef(() => OrdersModule),
  ],
  providers: [InvoiceService],
  controllers: [InvoiceController],
  exports: [InvoiceService],
})
export class InvoiceModule {}
