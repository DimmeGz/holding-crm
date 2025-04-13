import { Controller, Get } from '@nestjs/common';

import { TransitService } from './transit.service';

@Controller('transit')
export class TransitController {
  constructor(private readonly transitService: TransitService) {}

  @Get()
  getTransitLines() {
    return this.transitService.getTransitLines();
  }
}
