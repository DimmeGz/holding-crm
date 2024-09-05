import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
})
export class LibsModule {}
