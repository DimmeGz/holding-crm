import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { GoodsService } from './goods.service';

import { GetBatchDataResponseDTO, GetProductDataResponseDTO } from './dto';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get('batch/:batchId')
  getBatchData(
    @Param('batchId', ParseIntPipe) batchId: number,
  ): Promise<GetBatchDataResponseDTO> {
    return this.goodsService.getBatchData(batchId);
  }

  @Get('product/:productId')
  getProductData(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<GetProductDataResponseDTO> {
    return this.goodsService.getProductData(productId);
  }
}
