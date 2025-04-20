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

import { Production } from './entities';

import { CreateProductionDTO, UpdateProductionDTO } from './dto';

@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Get()
  async getProductions(): Promise<Production[]> {
    return this.productionService.getProductions();
  }

  @Get(':productionId')
  @UsePipes(new ParseIntPipe())
  async getProductionById(
    @Param('productionId') productionId: number,
  ): Promise<Production> {
    return this.productionService.getProductionById(productionId);
  }

  @Post()
  createProduction(
    @Body() createProductionDTO: CreateProductionDTO,
  ): Promise<Production> {
    return this.productionService.createProduction(createProductionDTO);
  }

  @Patch(':productionId')
  updateProduction(
    @Param('productionId', new ParseIntPipe()) productionId: number,
    @Body() updateProductionDTO: UpdateProductionDTO,
  ): Promise<Production> {
    return this.productionService.updateProduction(
      productionId,
      updateProductionDTO,
    );
  }

  @Delete(':productionId')
  @UsePipes(new ParseIntPipe())
  removeProduction(
    @Param('productionId') productionId: number,
  ): Promise<Production> {
    return this.productionService.removeProduction(productionId);
  }

  @Patch('change-status/:productionId')
  @UsePipes(new ParseIntPipe())
  changeProductionStatus(
    @Param('productionId') productionId: number,
  ): Promise<Production> {
    return this.productionService.changeProductionStatus(productionId);
  }
}
