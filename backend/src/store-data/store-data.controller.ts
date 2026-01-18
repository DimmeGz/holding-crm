import { Controller, Get } from '@nestjs/common';
import { StoreDataService } from './store-data.service';

@Controller('store-data')
export class StoreDataController {
  constructor(private readonly storeDataService: StoreDataService) {}

  @Get()
  async getAllStoreData() {
    return this.storeDataService.getAllStoreData();
  }
}
