import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderConfirmation } from './entities';
import { OrdersConfirmationService } from './orders-confirmation.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderConfirmation])],
  providers: [OrdersConfirmationService],
  exports: [OrdersConfirmationService],
})
export class OrdersConfirmationModule {}
