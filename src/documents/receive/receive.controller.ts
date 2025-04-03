import { Controller, Get, Param } from '@nestjs/common';
import { ReceiveService } from './receive.service';

@Controller('receive')
export class ReceiveController {
  constructor(private readonly receiveService: ReceiveService) {}

  @Get()
  getReceives() {
    return this.receiveService.getReceives();
  }

  @Get(':receiveId')
  getReceiveById(@Param('receiveId') receiveId: number) {
    return this.receiveService.getReceiveById(receiveId);
  }
}
