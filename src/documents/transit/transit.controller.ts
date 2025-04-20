import { Controller, Get } from '@nestjs/common';

import { TransitService } from './transit.service';

import { TransitLine } from './entities';

@Controller('transit')
export class TransitController {
  constructor(private readonly transitService: TransitService) {}

  @Get()
  getTransitLines(): Promise<TransitLine[]> {
    return this.transitService.getTransitLines();
  }
}
