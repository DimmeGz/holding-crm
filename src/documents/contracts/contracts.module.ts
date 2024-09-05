import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract, ContractLine } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, ContractLine])],
})
export class ContractsModule {}
