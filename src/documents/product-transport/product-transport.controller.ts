import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ProductTransportService } from './product-transport.service';
import { CreateProductTransportDTO } from './dto';

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

  @Post()
  createProductTransport(
    @Body() createProductTransportDTO: CreateProductTransportDTO,
  ) {
    return this.productTransportService.createProductTransport(
      createProductTransportDTO,
    );
  }
}
