import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
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
  @UsePipes(new ParseIntPipe())
  async getProductionById(@Param('productionId') productionId: number) {
    return this.productionService.getProductionById(productionId);
  }

  @Post()
  createProduction(@Body() createProductionDTO: CreateProductionDTO) {
    return this.productionService.createProduction(createProductionDTO);
  }

  @Patch(':productionId')
  updateProduction(
    @Param('productionId', new ParseIntPipe()) productionId: number,
    @Body() updateProductionDTO: UpdateProductionDTO,
  ) {
    return this.productionService.updateProduction(
      productionId,
      updateProductionDTO,
    );
  }

  @Delete(':productionId')
  @UsePipes(new ParseIntPipe())
  removeProduction(@Param('productionId') productionId: number) {
    return this.productionService.removeProduction(productionId);
  }

  @Patch('change-status/:productionId')
  @UsePipes(new ParseIntPipe())
  changeProductionStatus(@Param('productionId') productionId: number) {
    return this.productionService.changeProductionStatus(productionId);
  }
}
