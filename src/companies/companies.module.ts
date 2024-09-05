import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

import { Account, Company } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Company])],
  providers: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
