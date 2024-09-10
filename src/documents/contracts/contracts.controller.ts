import { Controller, Get } from '@nestjs/common';

import { ContractsService } from './contracts.service';

@Controller()
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get('contracts')
  getContracts() {
    return this.contractsService.getContracts();
  }
}
