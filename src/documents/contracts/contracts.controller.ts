import { Controller, Get, Param } from '@nestjs/common';

import { ContractsService } from './contracts.service';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  getContracts() {
    return this.contractsService.getContracts();
  }

  @Get('/:contractId')
  getContractById(@Param('contractId') contractId: number) {
    return this.contractsService.getContractById(+contractId);
  }
}
