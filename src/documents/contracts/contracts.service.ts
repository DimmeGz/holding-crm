import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { GoodsService } from '../../goods';
import { OrdersService } from '../orders';
import { ShipmentService } from '../shipment';

import {
  getProductIdsFromProductLines,
  getServiceIdsFromServiceLines,
} from '../../common/utils';

import { Contract } from './entities';
import { CreateContractDTO, UpdateContractDTO } from './dto';
import {
  GetContractResponseDTO,
  GetContractsResponseDTO,
} from './dto/response-dto';
import { GetContractsQueryDTO } from './dto/query-dto';
import { DocumentTypeEnum } from '../common/enums';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly shipmentsService: ShipmentService,
    private readonly goodsService: GoodsService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<Contract> {
    return this.contractsRepository.createQueryBuilder('contract');
  }

  private applyContractListSelect(
    qb: SelectQueryBuilder<Contract>,
  ): SelectQueryBuilder<Contract> {
    return qb
      .leftJoin('contract.seller', 'seller')
      .leftJoin('contract.buyer', 'buyer')
      .select([
        'contract.id',
        'contract.name',
        'seller.name',
        'buyer.name',
        'contract.signatureDate',
        'contract.term',
      ]);
  }

  private applyContractDetailSelect(
    qb: SelectQueryBuilder<Contract>,
  ): SelectQueryBuilder<Contract> {
    return qb
      .leftJoin('contract.seller', 'seller')
      .leftJoin('contract.buyer', 'buyer')
      .leftJoin('contract.currency', 'currency')
      .leftJoin('contract.incoterms', 'incoterms')
      .leftJoin('contract.contractLines', 'contractLine')
      .leftJoin('contractLine.product', 'product')
      .leftJoin('contractLine.package', 'package')
      .leftJoin('contract.contractServiceLines', 'contractServiceLine')
      .leftJoin('contractServiceLine.service', 'service')
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
        'contractLine.id',
        'contractLine.qty',
        'contractLine.shipQty',
        'contractLine.price',
        'product.id',
        'product.name',
        'package.name',
        'contractServiceLine.id',
        'contractServiceLine.price',
        'contractServiceLine.qty',
        'service.name',
      ]);
  }

  private ApplyQueryFilter(
    qb: SelectQueryBuilder<Contract>,
    query: GetContractsQueryDTO,
  ) {
    if (!query || Object.keys(query).length === 0) {
      return qb; // Return the query builder unmodified if query is empty
    }

    if (query.type) {
      if (query.type === DocumentTypeEnum.SELLER) {
        qb.andWhere('contract.sellerId = :sellerId', {
          sellerId: query.company,
        });
      } else {
        qb.andWhere('contract.buyerId = :buyerId', {
          buyerId: query.company,
        });
      }
    } else if (query.company) {
      qb.andWhere(
        '(contract.sellerId = :company OR contract.buyerId = :company)',
        { company: query.company },
      );
    }

    if (query.process) {
      qb.leftJoin('contract.technicalProcesses', 'technicalProcess').andWhere(
        'technicalProcess.id = :processId',
        {
          processId: query.process,
        },
      );
    }
    return qb;
  }

  async getContracts(
    query: GetContractsQueryDTO,
  ): Promise<GetContractsResponseDTO> {
    const actualContractsQuery = this.applyContractListSelect(
      this.ApplyQueryFilter(this.createBaseQueryBuilder(), query),
    )
      .andWhere('contract.isArchived = false')
      .andWhere('contract.parent IS NULL');

    const archivedContractsQuery = this.applyContractListSelect(
      this.ApplyQueryFilter(this.createBaseQueryBuilder(), query),
    )
      .andWhere('contract.isArchived = true')
      .andWhere('contract.parent IS NULL');

    const actualContractsWithArchivedChildrenQuery = this.ApplyQueryFilter(
      this.createBaseQueryBuilder(),
      query,
    )
      .andWhere('contract.isArchived = false')
      .andWhere('contract.parent IS NULL')
      .leftJoin('contract.children', 'children')
      .andWhere('children.isArchived = true');

    const actualContracts = await actualContractsQuery.getMany();

    const archivedContracts = await archivedContractsQuery.getMany();

    const archivedChildContracts = await this.applyContractListSelect(
      actualContractsWithArchivedChildrenQuery,
    ).getMany();

    const allArchivedContracts = [
      ...archivedContracts,
      ...archivedChildContracts,
    ];

    return {
      actualContracts,
      archivedContracts: allArchivedContracts,
    };
  }

  async getContractById(contractId: number): Promise<GetContractResponseDTO> {
    const contract = await this.applyContractDetailSelect(
      this.createBaseQueryBuilder(),
    )
      .where('contract.id = :contractId', { contractId })
      .getOne();

    if (!contract) {
      throw new NotFoundException(`Contract with id ${contractId} not found`);
    }

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

  async createContract(
    createContractDTO: CreateContractDTO,
  ): Promise<Contract> {
    const newContract = this.contractsRepository.create(createContractDTO);

    newContract.technicalProcesses =
      await this.getTechnicalProcesses(createContractDTO);
    newContract.status = false;
    newContract.isArchived = false;
    newContract.createdAt = new Date();
    newContract.signatureDate =
      newContract.signatureDate || newContract.createdAt;
    newContract.comment = newContract.comment || '';
    newContract.paymentDelay = newContract.paymentDelay || 0;
    newContract.vat = newContract.vat || 0;

    return await this.contractsRepository.save(newContract);
  }

  private async getTechnicalProcesses(
    createContractDTO: CreateContractDTO,
  ): Promise<{ id: number }[]> {
    const productIds = getProductIdsFromProductLines(
      createContractDTO.contractLines,
    );
    const productProcesses =
      await this.goodsService.getTechnicalProcessesFromProductIds(productIds);

    const serviceIds = getServiceIdsFromServiceLines(
      createContractDTO.contractServiceLines,
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
  ): Promise<Contract> {
    const contract = await this.createBaseQueryBuilder()
      .where('contract.id = :contractId', { contractId })
      .andWhere('contract.status = FALSE')
      .leftJoinAndSelect('contract.contractLines', 'contractLines')
      .leftJoinAndSelect(
        'contract.contractServiceLines',
        'contractServiceLines',
      )
      .leftJoinAndSelect('contract.technicalProcesses', 'technicalProcesses')
      .getOne();

    if (!contract) {
      throw new NotFoundException(
        `Contract with id: ${contractId} and status: false not found`,
      );
    }

    const updatedContractLinesIds = updateContractDTO.contractLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const contractLinesToDelete = contract.contractLines.filter(
      (line) => !updatedContractLinesIds.includes(line.id),
    );

    const updatedContractServiceLinesIds =
      updateContractDTO.contractServiceLines
        .filter((line) => line['id'])
        .map((line) => line['id']);
    const contractServiceLinesToDelete = contract.contractServiceLines.filter(
      (line) => !updatedContractServiceLinesIds.includes(line.id),
    );

    const updated = Object.assign(contract, updateContractDTO);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    updated.technicalProcesses =
      await this.getTechnicalProcesses(updateContractDTO);

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

  async removeContract(contractId: number): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({
      where: { id: contractId },
      relations: ['contractLines', 'contractServiceLines'],
    });

    if (!contract) {
      throw new NotFoundException(`Contract with id: ${contractId} not found`);
    }

    return await this.contractsRepository.remove(contract);
  }

  async changeContractStatus(contractId: number): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException(`Contract with id: ${contractId} not found`);
    }

    contract.status = !contract.status;

    return await this.contractsRepository.save(contract);
  }

  async getOrderPrefix(contractId: number): Promise<string> {
    const contract = await this.createBaseQueryBuilder()
      .where('contract.id = :contractId', { contractId })
      .select(['contract.id', 'contract.orderPrefix'])
      .getOne();

    if (!contract) {
      throw new NotFoundException(`Contract with id: ${contractId} not found`);
    }

    return contract.orderPrefix || '';
  }
}
