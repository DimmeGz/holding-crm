import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Invoice } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
})
export class InvoiceModule {}
