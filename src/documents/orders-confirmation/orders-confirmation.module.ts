import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderConfirmation } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([OrderConfirmation])],
})
export class OrdersConfirmationModule {}
