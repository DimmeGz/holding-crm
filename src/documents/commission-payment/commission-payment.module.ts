import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommissionPayment } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([CommissionPayment])],
})
export class CommissionPaymentModule {}
