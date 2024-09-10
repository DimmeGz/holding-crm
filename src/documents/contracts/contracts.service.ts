import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Contract } from './entities';
import { ContractsResponseDTO } from './dto';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>,
  ) {}

  async getContracts(): Promise<ContractsResponseDTO> {
    const actualContracts: Contract[] = await this.contractsRepository
      .createQueryBuilder('actualContract')
      .where('actualContract.isArchived = false')
      .andWhere('actualContract.parent IS NULL')
      .leftJoinAndSelect('actualContract.children', 'children')
      .andWhere('children.isArchived = false')
      .getMany();

    let archivedContracts: Contract[] = await this.contractsRepository
      .createQueryBuilder('archivedContract')
      .where('archivedContract.isArchived = true')
      .andWhere('archivedContract.parent IS NULL')
      .leftJoinAndSelect('archivedContract.children', 'children')
      .getMany();

    const archivedChildContracts: Contract[] = await this.contractsRepository
      .createQueryBuilder('archivedChildContract')
      .where('archivedChildContract.isArchived = false')
      .andWhere('archivedChildContract.parent IS NULL')
      .leftJoinAndSelect('archivedChildContract.children', 'children')
      .andWhere('children.isArchived = true')
      .getMany();

    archivedContracts = archivedContracts.concat(archivedChildContracts);

    return {
      actualContracts,
      archivedContracts,
    };
  }
}
