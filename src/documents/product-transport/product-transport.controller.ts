import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

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

  @Delete(':productTransportId')
  removeProductTransport(
    @Param('productTransportId') productTransportId: number,
  ) {
    return this.productTransportService.removeProductTransport(
      productTransportId,
    );
  }

  @Patch('change-status/:productTransportId')
  changeProductTransportStatus(
    @Param('productTransportId') productTransportId: number,
  ) {
    return this.productTransportService.changeProductTransportStatus(
      productTransportId,
    );
  }
}
