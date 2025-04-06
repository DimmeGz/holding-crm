import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ContractsService } from './contracts.service';
import { CreateContractDTO } from './dto';

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

  @Post()
  createContract(@Body() createContractDTO: CreateContractDTO) {
    return this.contractsService.createContract(createContractDTO);
  }
}
