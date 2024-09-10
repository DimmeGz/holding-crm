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
      .leftJoin('actualContract.seller', 'seller')
      .leftJoin('actualContract.buyer', 'buyer')
      .leftJoin('actualContract.children', 'children')
      .andWhere('children.isArchived = false')
      .leftJoin('children.seller', 'childSeller')
      .leftJoin('children.buyer', 'childBuyer')
      .select([
        'actualContract.id',
        'actualContract.name',
        'seller.name',
        'buyer.name',
        'actualContract.signatureDate',
        'actualContract.term',
        'children.name',
        'childSeller.name',
        'childBuyer.name',
        'children.signatureDate',
        'children.term',
      ])
      .getMany();

    let archivedContracts: Contract[] = await this.contractsRepository
      .createQueryBuilder('archivedContract')
      .where('archivedContract.isArchived = true')
      .andWhere('archivedContract.parent IS NULL')
      .leftJoin('archivedContract.seller', 'seller')
      .leftJoin('archivedContract.buyer', 'buyer')
      .leftJoin('archivedContract.children', 'children')
      .leftJoin('children.seller', 'childSeller')
      .leftJoin('children.buyer', 'childBuyer')
      .select([
        'archivedContract.id',
        'archivedContract.name',
        'seller.name',
        'buyer.name',
        'archivedContract.signatureDate',
        'archivedContract.term',
        'children.name',
        'childSeller.name',
        'childBuyer.name',
        'children.signatureDate',
        'children.term',
      ])
      .getMany();

    const archivedChildContracts: Contract[] = await this.contractsRepository
      .createQueryBuilder('archivedChildContract')
      .where('archivedChildContract.isArchived = false')
      .andWhere('archivedChildContract.parent IS NULL')
      .leftJoin('archivedChildContract.seller', 'seller')
      .leftJoin('archivedChildContract.buyer', 'buyer')
      .leftJoin('archivedChildContract.children', 'children')
      .andWhere('children.isArchived = true')
      .leftJoin('children.seller', 'childSeller')
      .leftJoin('children.buyer', 'childBuyer')
      .select([
        'archivedChildContract.id',
        'archivedChildContract.name',
        'seller.name',
        'buyer.name',
        'archivedChildContract.signatureDate',
        'archivedChildContract.term',
        'children.name',
        'childSeller.name',
        'childBuyer.name',
        'children.signatureDate',
        'children.term',
      ])
      .getMany();

    archivedContracts = archivedContracts.concat(archivedChildContracts);

    return {
      actualContracts,
      archivedContracts,
    };
  }

  async getContract(contractId: number): Promise<Contract> {
    const contract = await this.contractsRepository
      .createQueryBuilder('contract')
      .where('contract.id = :contractId', { contractId })
      .leftJoin('contract.seller', 'seller')
      .leftJoin('contract.buyer', 'buyer')
      .leftJoin('contract.currency', 'currency')
      .leftJoin('contract.incoterms', 'incoterms')
      .select([
        'contract.id',
        'contract.status',
        'contract.signatureDate',
        'contract.term',
        'contract.vat',
        'contract.paymentDelay',
        'contract.term',
        'contract.transportPlace',
        'contract.orderPrefix',
        'seller.name',
        'buyer.name',
        'currency.name',
        'incoterms.name',
      ])
      .leftJoin('contract.contractLines', 'contractLine')
      .leftJoin('contractLine.product', 'product')
      .leftJoin('contractLine.package', 'package')
      .addSelect([
        'contractLine.id',
        'contractLine.shipQty',
        'contractLine.price',
        'product.id',
        'product.name',
        'package.name',
      ])
      .getOne();

    return contract;
  }
}
