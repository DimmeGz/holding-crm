import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommissionInvoice } from './entities';
import { CommissionInvoiceService } from './commission-invoice.service';
import { CommissionInvoiceController } from './commission-invoice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CommissionInvoice])],
  providers: [CommissionInvoiceService],
  controllers: [CommissionInvoiceController],
})
export class CommissionInvoiceModule {}
