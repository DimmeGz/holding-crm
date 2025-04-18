import { Controller, Get, Param } from '@nestjs/common';
import { GoodsService } from './goods.service';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get('batch/:batchId')
  getBatchData(@Param('batchId') batchId: number) {
    return this.goodsService.getBatchData(batchId);
  }

  @Get('/product/:productId')
  getProductData(@Param('productId') productId: number) {
    return this.goodsService.getProductData(productId);
  }
}
