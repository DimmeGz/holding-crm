import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommissionInvoice } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([CommissionInvoice])],
})
export class CommissionInvoiceModule {}
