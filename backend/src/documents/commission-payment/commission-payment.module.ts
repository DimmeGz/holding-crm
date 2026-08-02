import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '../../companies';
import { LibsModule } from '../../libs';
import { CommissionInvoiceModule } from '../commission-invoice';

import { CommissionPayment, CommissionPaymentLine } from './entities';
import { CommissionPaymentService } from './commission-payment.service';
import { CommissionPaymentController } from './commission-payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommissionPayment, CommissionPaymentLine]),
    CompaniesModule,
    LibsModule,
    forwardRef(() => CommissionInvoiceModule),
  ],
  providers: [CommissionPaymentService],
  controllers: [CommissionPaymentController],
  exports: [CommissionPaymentService],
})
export class CommissionPaymentModule {}
