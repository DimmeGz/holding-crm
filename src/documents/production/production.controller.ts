import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ProductionService } from './production.service';
import { CreateProductionDTO, UpdateProductionDTO } from './dto';

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

  @Patch(':productionId')
  updateProduction(
    @Param('productionId') productionId: number,
    @Body() updateProductionDTO: UpdateProductionDTO,
  ) {
    return this.productionService.updateProduction(
      productionId,
      updateProductionDTO,
    );
  }

  @Delete(':productionId')
  removeProduction(@Param('productionId') productionId: number) {
    return this.productionService.removeProduction(productionId);
  }

  @Patch('change-status/:productionId')
  changeProductionStatus(@Param('productionId') productionId: number) {
    return this.productionService.changeProductionStatus(productionId);
  }
}
