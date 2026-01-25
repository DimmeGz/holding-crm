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
import { GetContractResponseDTO } from './dto/response-dto';
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
      .leftJoin('contract.children', 'children')
      .where('contract.parentId IS NULL')
      .select([
        'contract.id',
        'contract.sellerId',
        'contract.buyerId',
        'contract.name',
        'contract.signatureDate',
        'contract.term',
        'contract.parentId',
        'contract.isArchived',
        'children.id',
        'children.sellerId',
        'children.buyerId',
        'children.name',
        'children.signatureDate',
        'children.term',
        'children.parentId',
        'children.isArchived',
      ])
      .orderBy('contract.id', 'DESC');
  }

  private applyContractDetailSelect(
    qb: SelectQueryBuilder<Contract>,
  ): SelectQueryBuilder<Contract> {
    return qb
      .leftJoin('contract.incoterms', 'incoterms')
      .leftJoin('contract.contractLines', 'contractLine')
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
        'contract.sellerId',
        'contract.buyerId',
        'contract.currencyId',
        'incoterms.name',
        'contractLine.id',
        'contractLine.qty',
        'contractLine.shipQty',
        'contractLine.price',
        'contractLine.productId',
        'contractLine.packageId',
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
  ): Promise<Partial<Contract>[]> {
    const contracts = await this.applyContractListSelect(
      this.ApplyQueryFilter(this.createBaseQueryBuilder(), query),
    ).getMany();

    return contracts;
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
      contractLine['shipLeft'] = shippedProducts[contractLine.productId]
        ? contractLine.qty - shippedProducts[contractLine.productId]
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
