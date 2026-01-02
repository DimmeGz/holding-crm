import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '../../companies';
import { LibsModule } from '../../libs';

import { CommissionPayment } from './entities';
import { CommissionPaymentService } from './commission-payment.service';
import { CommissionPaymentController } from './commission-payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommissionPayment]),
    CompaniesModule,
    LibsModule,
  ],
  providers: [CommissionPaymentService],
  controllers: [CommissionPaymentController],
})
export class CommissionPaymentModule {}
