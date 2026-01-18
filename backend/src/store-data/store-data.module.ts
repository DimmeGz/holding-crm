import { Module } from '@nestjs/common';
import { StoreDataService } from './store-data.service';
import { StoreDataController } from './store-data.controller';
import { CompaniesModule } from 'src/companies';
import { LibsModule } from 'src/libs';
import { WarehouseModule } from 'src/warehouse';
import { GoodsModule } from 'src/goods';

@Module({
  imports: [CompaniesModule, GoodsModule, LibsModule, WarehouseModule],
  providers: [StoreDataService],
  controllers: [StoreDataController],
})
export class StoreDataModule {}
