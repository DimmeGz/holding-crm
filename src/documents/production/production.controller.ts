import { Controller, Get, Param } from '@nestjs/common';

import { ProductionService } from './production.service';

@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Get()
  async getProductions() {
    return this.productionService.getProductions();
  }

  @Get(':productionId')
  async getProductionById(@Param('productionId') productionId: number) {
    return this.productionService.getProductionById(productionId);
  }
}
