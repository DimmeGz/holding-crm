import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { ProductTransportService } from './product-transport.service';
import { CreateProductTransportDTO, UpdateProductTransportDTO } from './dto';

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

  @Patch(':productTransportId')
  updateProductTransport(
    @Param('productTransportId') productTransportId: number,
    @Body() updateProductTransportDTO: UpdateProductTransportDTO,
  ) {
    return this.productTransportService.updateProductTransport(
      productTransportId,
      updateProductTransportDTO,
    );
  }
}
