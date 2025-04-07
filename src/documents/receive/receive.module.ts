import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReceiveService } from './receive.service';
import { ReceiveController } from './receive.controller';

import { Receive } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Receive])],
  providers: [ReceiveService],
  controllers: [ReceiveController],
  exports: [ReceiveService],
})
export class ReceiveModule {}
