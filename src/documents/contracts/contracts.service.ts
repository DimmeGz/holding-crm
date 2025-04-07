import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Contract } from './entities';
import {
  ContractsResponseDTO,
  CreateContractDTO,
  UpdateContractDTO,
} from './dto';

import { GoodsService } from '../../goods';
import { OrdersService } from '../orders';
import { ShipmentService } from '../shipment';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>,
    private readonly shipmentsService: ShipmentService,
    private readonly ordersService: OrdersService,
    private readonly goodsService: GoodsService,
    @InjectDataSource() private dataSource: DataSource,
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
        'children.id',
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
        'children.id',
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
        'children.id',
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

  async getContractById(contractId: number) {
    const contract = await this.contractsRepository
      .createQueryBuilder('contract')
      .where('contract.id = :contractId', { contractId })
      .leftJoin('contract.seller', 'seller')
      .leftJoin('contract.buyer', 'buyer')
      .leftJoin('contract.currency', 'currency')
      .leftJoin('contract.incoterms', 'incoterms')
      .select([
        'contract.id',
        'contract.name',
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
        'contractLine.qty',
        'contractLine.shipQty',
        'contractLine.price',
        'product.id',
        'product.name',
        'package.name',
      ])
      .leftJoin('contract.contractServiceLines', 'contractServiceLine')
      .leftJoin('contractServiceLine.service', 'service')
      .addSelect([
        'contractServiceLine.id',
        'contractServiceLine.price',
        'contractServiceLine.qty',
        'service.name',
      ])
      .getOne();

    const shippedProducts =
      await this.shipmentsService.getShippedProductsByContract(contractId);

    for (const contractLine of contract.contractLines) {
      contractLine['shipLeft'] = shippedProducts[contractLine.product.id]
        ? contractLine.qty - shippedProducts[contractLine.product.id]
        : contractLine.qty;
    }

    const orders = await this.ordersService.getOrdersByContractId(contractId);

    return { contract, orders };
  }

  async createContract(createContractDTO: CreateContractDTO) {
    createContractDTO['status'] = false;
    createContractDTO['isArchived'] = false;
    createContractDTO['createdAt'] = new Date();
    createContractDTO['created_by_id'] = 1;
    createContractDTO.signatureDate =
      createContractDTO.signatureDate || createContractDTO['createdAt'];
    createContractDTO.comment = createContractDTO.comment || '';
    createContractDTO.paymentDelay = createContractDTO.paymentDelay || 0;
    createContractDTO.vat = createContractDTO.vat || 0;

    createContractDTO['technicalProcesses'] =
      await this.getTechnicalProcesses(createContractDTO);

    const newContract = new Contract(createContractDTO);

    return await this.contractsRepository.save(newContract);
  }

  private async getTechnicalProcesses(createContractDTO: CreateContractDTO) {
    const productIds = createContractDTO.contractLines.map(
      (line) => line.productId,
    );
    const productProcesses =
      await this.goodsService.getTechnicalProcessesFromProductIds(productIds);

    const serviceIds = createContractDTO.contractServiceLines.map(
      (line) => line.serviceId,
    );
    const serviceProcesses =
      await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);

    const technicalProcesses = [
      ...new Set([...productProcesses, ...serviceProcesses]),
    ];

    return technicalProcesses.map((process) => ({ id: process.id }));
  }

  async updateContract(
    contractId: number,
    updateContractDTO: UpdateContractDTO,
  ) {
    const contract = await this.contractsRepository
      .createQueryBuilder('contract')
      .where('contract.id = :contractId', { contractId })
      .andWhere('contract.status = FALSE')
      .leftJoinAndSelect('contract.contractLines', 'contractLines')
      .leftJoinAndSelect(
        'contract.contractServiceLines',
        'contractServiceLines',
      )
      .leftJoinAndSelect('contract.technicalProcesses', 'technicalProcesses')
      .getOne();

    const updatedContractLinesIds = [];
    for (const line of updateContractDTO.contractLines) {
      if (line['id']) {
        updatedContractLinesIds.push(line['id']);
      }
    }
    const contractLinesToDelete = contract.contractLines.filter(
      (line) => !updatedContractLinesIds.includes(line.id),
    );

    const updatedContractServiceLinesIds = [];
    for (const line of updateContractDTO.contractServiceLines) {
      if (line['id']) {
        updatedContractServiceLinesIds.push(line['id']);
      }
    }
    const contractServiceLinesToDelete = contract.contractServiceLines.filter(
      (line) => !updatedContractServiceLinesIds.includes(line.id),
    );

    const updated = Object.assign(contract, updateContractDTO);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (contractLinesToDelete.length) {
        await queryRunner.manager.remove(contractLinesToDelete);
      }

      if (contractServiceLinesToDelete.length) {
        await queryRunner.manager.remove(contractServiceLinesToDelete);
      }

      await queryRunner.manager.save(updated);

      await queryRunner.commitTransaction();

      return updated;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }
}
