import { Controller, Get, Param } from '@nestjs/common';

import { ProductTransportService } from './product-transport.service';

@Controller('transport')
export class ProductTransportController {
  constructor(
    private readonly productTransportService: ProductTransportService,
  ) {}

  @Get()
  async getProductTransports() {
    return this.productTransportService.getProductTransports();
  }

  @Get(':productTransportId')
  async getProductTransportById(
    @Param('productTransportId') productTransportId: number,
  ) {
    return this.productTransportService.getProductTransportById(
      productTransportId,
    );
  }
}
