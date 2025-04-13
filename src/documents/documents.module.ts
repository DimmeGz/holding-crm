import { Module } from '@nestjs/common';

import { ContractsModule } from './contracts';
import { CommissionInvoiceModule } from './commission-invoice';
import { CommissionPaymentModule } from './commission-payment';
import { ProductionModule } from './production';
import { ProductTransportModule } from './product-transport';

@Module({
  imports: [
    ContractsModule,
    CommissionInvoiceModule,
    CommissionPaymentModule,
    ProductionModule,
    ProductTransportModule,
  ],
})
export class DocumentsModule {}
