import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommissionPayment } from './entities';
import { CommissionPaymentService } from './commission-payment.service';
import { CommissionPaymentController } from './commission-payment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CommissionPayment])],
  providers: [CommissionPaymentService],
  controllers: [CommissionPaymentController],
})
export class CommissionPaymentModule {}
