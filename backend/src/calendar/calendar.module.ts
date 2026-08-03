import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

import { InvoiceLine } from '../documents/invoices/entities';
import { Order, OrderLine } from '../documents/orders/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderLine, InvoiceLine])],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
