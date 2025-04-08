import { Module } from '@nestjs/common';

import { ContractsModule } from './contracts';
import { CommissionInvoiceModule } from './commission-invoice';
import { CommissionPaymentModule } from './commission-payment';
import { ProductionModule } from './production';
import { TransitModule } from './transit';
import { ProductTransportModule } from './product-transport';

@Module({
  imports: [
    ContractsModule,
    CommissionInvoiceModule,
    CommissionPaymentModule,
    ProductionModule,
    TransitModule,
    ProductTransportModule,
  ],
})
export class DocumentsModule {}
