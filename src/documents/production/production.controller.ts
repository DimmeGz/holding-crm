import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ProductionService } from './production.service';
import { CreateProductionDTO } from './dto';

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

  @Post()
  createProduction(@Body() createProductionDTO: CreateProductionDTO) {
    return this.productionService.createProduction(createProductionDTO);
  }
}
