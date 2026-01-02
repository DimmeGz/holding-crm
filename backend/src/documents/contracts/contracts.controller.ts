import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';

import { ContractsService } from './contracts.service';

import { Contract } from './entities';

import { CreateContractDTO, UpdateContractDTO } from './dto';
import { GetContractsQueryDTO } from './dto/query-dto';
import { GetContractResponseDTO } from './dto/response-dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  getContracts(
    @Query()
    query?: GetContractsQueryDTO,
  ) {
    return this.contractsService.getContracts(query);
  }

  @Get('/:contractId')
  @UsePipes(new ParseIntPipe())
  getContractById(
    @Param('contractId') contractId: number,
  ): Promise<GetContractResponseDTO> {
    return this.contractsService.getContractById(contractId);
  }

  @Post()
  createContract(
    @Body() createContractDTO: CreateContractDTO,
  ): Promise<Contract> {
    return this.contractsService.createContract(createContractDTO);
  }

  @Patch(':contractId')
  updateContract(
    @Param('contractId', new ParseIntPipe()) contractId: number,
    @Body() updateContractDTO: UpdateContractDTO,
  ): Promise<Contract> {
    return this.contractsService.updateContract(contractId, updateContractDTO);
  }

  @Delete(':contractId')
  @UsePipes(new ParseIntPipe())
  removeContract(@Param('contractId') contractId: number): Promise<Contract> {
    return this.contractsService.removeContract(contractId);
  }

  @Patch('change-status/:contractId')
  @UsePipes(new ParseIntPipe())
  changeContractStatus(
    @Param('contractId') contractId: number,
  ): Promise<Contract> {
    return this.contractsService.changeContractStatus(contractId);
  }
}
