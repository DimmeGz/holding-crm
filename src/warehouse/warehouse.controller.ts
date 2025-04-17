import { Controller, Get, Query } from '@nestjs/common';

import { WarehouseService } from './warehouse.service';
import { GetWarehouseQueryDTO } from './dto/query-dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  async getWarehouseAccountings(@Query() query?: GetWarehouseQueryDTO) {
    return this.warehouseService.getWarehouseAccountings(query);
  }
}
