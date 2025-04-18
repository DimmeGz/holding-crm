import { Controller, Get, Param, ParseIntPipe, UsePipes } from '@nestjs/common';
import { GoodsService } from './goods.service';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get('batch/:batchId')
  @UsePipes(new ParseIntPipe())
  getBatchData(@Param('batchId') batchId: number) {
    return this.goodsService.getBatchData(batchId);
  }

  @Get('/product/:productId')
  @UsePipes(new ParseIntPipe())
  getProductData(@Param('productId') productId: number) {
    return this.goodsService.getProductData(productId);
  }
}
