import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LibsModule } from '../../libs';
import { ProductTransport } from './entities';

import { ProductTransportService } from './product-transport.service';
import { ProductTransportController } from './product-transport.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTransport]), LibsModule],
  providers: [ProductTransportService],
  controllers: [ProductTransportController],
})
export class ProductTransportModule {}
