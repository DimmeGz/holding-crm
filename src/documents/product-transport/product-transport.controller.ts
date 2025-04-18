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
  @UsePipes(new ParseIntPipe())
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
    @Param('productTransportId', new ParseIntPipe()) productTransportId: number,
    @Body() updateProductTransportDTO: UpdateProductTransportDTO,
  ) {
    return this.productTransportService.updateProductTransport(
      productTransportId,
      updateProductTransportDTO,
    );
  }

  @Delete(':productTransportId')
  @UsePipes(new ParseIntPipe())
  removeProductTransport(
    @Param('productTransportId') productTransportId: number,
  ) {
    return this.productTransportService.removeProductTransport(
      productTransportId,
    );
  }

  @Patch('change-status/:productTransportId')
  @UsePipes(new ParseIntPipe())
  changeProductTransportStatus(
    @Param('productTransportId') productTransportId: number,
  ) {
    return this.productTransportService.changeProductTransportStatus(
      productTransportId,
    );
  }
}
