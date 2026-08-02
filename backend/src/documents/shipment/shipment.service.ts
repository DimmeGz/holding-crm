import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { GoodsService } from '../../goods';
import { ReceiveService } from '../receive';
import { TransitService } from '../transit';
import { WarehouseService } from '../../warehouse';

import {
  getProductIdsFromProductLines,
  getServiceIdsFromServiceLines,
} from '../../common/utils';

import { Shipment, ShipmentLine } from './entities';

import { CreateShipmentDTO, UpdateShipmentDTO } from './dto';
import { GetShipmentResponseDTO } from './dto/response-dto';
import { GetShipmentsQueryDTO } from './dto/query-dto';
import { DocumentTypeEnum } from '../common/enums';
import { MONTHS_BY_QUATER, OLD_RECORDS_LIMIT } from '../common/constants';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentsRepository: Repository<Shipment>,
    @InjectRepository(ShipmentLine)
    private readonly shipmentLinessRepository: Repository<ShipmentLine>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly goodsService: GoodsService,
    private readonly receiveService: ReceiveService,
    private readonly transitService: TransitService,
    private readonly warehouseService: WarehouseService,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<Shipment> {
    return this.shipmentsRepository.createQueryBuilder('shipment');
  }

  private applyShipmentListSelect(
    qb: SelectQueryBuilder<Shipment>,
  ): SelectQueryBuilder<Shipment> {
    return qb
      .leftJoin('shipment.invoice', 'invoice')
      .select([
        'shipment.id',
        'shipment.sellerId',
        'shipment.buyerId',
        'shipment.currencyId',
        'shipment.status',
        'shipment.documentSum',
        'shipment.expectedDate',
        'invoice.invoiceNumber',
      ]);
  }

  private applyShipmentDetailSelect(
    qb: SelectQueryBuilder<Shipment>,
  ): SelectQueryBuilder<Shipment> {
    return qb
      .leftJoin('shipment.invoice', 'invoice')
      .leftJoin('shipment.shipmentLines', 'shipmentLine')
      .leftJoin('shipment.shipmentServiceLines', 'shipmentServiceLine')
      .leftJoin('shipmentServiceLine.service', 'service')
      .leftJoin('shipment.incoterms', 'incoterms')
      .select([
        'shipment.id',
        'shipment.sellerId',
        'shipment.sellerWarehouseId',
        'shipment.buyerId',
        'shipment.currencyId',
        'shipment.status',
        'shipment.documentSum',
        'shipment.expectedDate',
        'shipment.incotermsId',
        'incoterms.name',
        'shipment.transportPlace',
        'shipment.transportAmount',
        'shipment.comment',
        'invoice.id',
        'invoice.invoiceNumber',
        'invoice.buyerWarehouseId',
        'shipmentLine',
        'shipmentServiceLine.id',
        'shipmentServiceLine.serviceId',
        'shipmentServiceLine.qty',
        'shipmentServiceLine.price',
        'service.id',
        'service.name',
      ]);
  }

  private applyQueryFilter(
    qb: SelectQueryBuilder<Shipment>,
    query?: GetShipmentsQueryDTO,
  ): SelectQueryBuilder<Shipment> {
    if (!query || Object.keys(query).length === 0) {
      return qb; // Return the query builder unmodified if query is empty
    }

    if (query.company) {
      if (query.type) {
        if (query.type === DocumentTypeEnum.BUYER) {
          qb.andWhere('shipment.buyerId = :companyId', {
            companyId: query.company,
          });
        } else if (query.type === DocumentTypeEnum.SELLER) {
          qb.andWhere('shipment.sellerId = :companyId', {
            companyId: query.company,
          });
        }
      } else {
        qb.andWhere(
          new Brackets((subQb) => {
            subQb
              .where('shipment.sellerId = :companyId', {
                companyId: query.company,
              })
              .orWhere('shipment.buyerId = :companyId', {
                companyId: query.company,
              });
          }),
        );
      }
    }

    // query.date have formet YYYY-Q or "old"
    if (query.date) {
      if (query.date === 'old') {
        qb.andWhere('EXTRACT(YEAR FROM shipment.expectedDate) < :maxYear', {
          maxYear: OLD_RECORDS_LIMIT,
        });
      } else {
        const [year, quarter] = query.date.split('-');
        const startDate = new Date(
          +year,
          MONTHS_BY_QUATER[quarter].start - 1,
          1,
        );
        const endDate = new Date(+year, MONTHS_BY_QUATER[quarter].end);

        qb.andWhere('shipment.expectedDate BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }
    }

    return qb;
  }

  async getShipments(query?: GetShipmentsQueryDTO): Promise<Shipment[]> {
    const qb = this.createBaseQueryBuilder();

    this.applyShipmentListSelect(qb);
    this.applyQueryFilter(qb, query);

    return qb.orderBy('shipment.id', 'DESC').getMany();
  }

  async getShipmentById(shipmentId: number): Promise<GetShipmentResponseDTO> {
    const qb = this.createBaseQueryBuilder();

    this.applyShipmentDetailSelect(qb);

    const shipment = await qb
      .where('shipment.id = :shipmentId', { shipmentId })
      .getOne();

    if (!shipment) {
      throw new NotFoundException(`Shipment with id: ${shipmentId} not found`);
    }

    const receives =
      await this.receiveService.getReceivesByShipmentId(shipmentId);

    return { shipment, receives };
  }

  async getShippedProductsByContract(
    contractId: number,
  ): Promise<{ number?: number }> {
    const shippedLines = await this.shipmentLinessRepository
      .createQueryBuilder('shipmentLine')
      .leftJoin('shipmentLine.shipment', 'shipment')
      .where('shipment.status = TRUE')
      .leftJoin('shipment.invoice', 'invoice')
      .leftJoin('invoice.invoiceLines', 'invoiceLine')
      .leftJoin('invoiceLine.order', 'order')
      .leftJoin('order.contract', 'contract')
      .andWhere('contract.id = :contractId', { contractId })
      .leftJoin('shipmentLine.product', 'product')
      .select(['shipmentLine.id', 'shipmentLine.qty', 'product.id'])
      .getMany();

    return shippedLines.reduce((acc, { product: { id }, qty }) => {
      acc[id] = (acc[id] || 0) + qty;
      return acc;
    }, {});
  }

  async getShipmentsByInvoiceId(invoiceId: number): Promise<Shipment[]> {
    const shipments = await this.createBaseQueryBuilder()
      .where('shipment.invoiceId = :invoiceId', { invoiceId })
      .select(['shipment.id', 'shipment.status'])
      .orderBy('shipment.id', 'ASC')
      .getMany();

    await Promise.all(
      shipments.map(async (shipment) => {
        shipment['receives'] =
          await this.receiveService.getReceivesByShipmentId(shipment.id);
      }),
    );

    return shipments;
  }

  async createShipment(
    createShipmentDTO: CreateShipmentDTO,
  ): Promise<Shipment> {
    const newShipment = new Shipment(createShipmentDTO);
    newShipment.createdAt = new Date();
    newShipment.comment = newShipment.comment || '';
    newShipment.transportPlace = newShipment.transportPlace || '';
    newShipment.status = false;
    newShipment.technicalProcesses =
      await this.getTechnicalProcesses(createShipmentDTO);
    newShipment.documentSum = this.calculateDocumentSum(createShipmentDTO);

    return await this.shipmentsRepository.save(newShipment);
  }

  private calculateDocumentSum(createShipmentDTO: CreateShipmentDTO): number {
    return (
      createShipmentDTO.shipmentLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      ) +
      createShipmentDTO.shipmentServiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      )
    );
  }

  private async getTechnicalProcesses(
    createShipmentDTO: CreateShipmentDTO,
  ): Promise<{ id: number }[]> {
    const productIds = getProductIdsFromProductLines(
      createShipmentDTO.shipmentLines,
    );
    const productProcesses =
      await this.goodsService.getTechnicalProcessesFromProductIds(productIds);

    const serviceIds = getServiceIdsFromServiceLines(
      createShipmentDTO.shipmentServiceLines,
    );
    const serviceProcesses =
      await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);

    const technicalProcesses = [
      ...new Set([...productProcesses, ...serviceProcesses]),
    ];

    return technicalProcesses.map((process) => ({ id: process.id }));
  }

  async updateShipment(
    shipmentId: number,
    updateShipmentDTO: UpdateShipmentDTO,
  ): Promise<Shipment> {
    const shipment = await this.createBaseQueryBuilder()
      .where('shipment.id = :shipmentId', { shipmentId })
      .andWhere('shipment.status = FALSE')
      .leftJoinAndSelect('shipment.shipmentLines', 'shipmentLines')
      .leftJoinAndSelect(
        'shipment.shipmentServiceLines',
        'shipmentServiceLines',
      )
      .leftJoinAndSelect('shipment.technicalProcesses', 'technicalProcesses')
      .getOne();

    if (!shipment) {
      throw new NotFoundException(
        `Shipment with id: ${shipmentId} and status: false not found`,
      );
    }

    const shipmentLines = updateShipmentDTO.shipmentLines ?? [];
    const shipmentServiceLines =
      updateShipmentDTO.shipmentServiceLines ?? [];

    const updatedShipmentLinesIds = shipmentLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const shipmentLinesToDelete = shipment.shipmentLines.filter(
      (line) => !updatedShipmentLinesIds.includes(line.id),
    );

    const updatedShipmentServiceLinesIds = shipmentServiceLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const shipmentServiceLinesToDelete = shipment.shipmentServiceLines.filter(
      (line) => !updatedShipmentServiceLinesIds.includes(line.id),
    );

    const updated = Object.assign(shipment, {
      ...updateShipmentDTO,
      shipmentLines,
      shipmentServiceLines,
    });
    updated.technicalProcesses =
      await this.getTechnicalProcesses(updated);
    updated.documentSum = this.calculateDocumentSum(updated);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (shipmentLinesToDelete.length) {
        await queryRunner.manager.remove(shipmentLinesToDelete);
      }

      if (shipmentServiceLinesToDelete.length) {
        await queryRunner.manager.remove(shipmentServiceLinesToDelete);
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

  async removeShipment(shipmentId: number): Promise<Shipment> {
    const shipment = await this.shipmentsRepository.findOne({
      where: { id: shipmentId, status: false },
      relations: ['shipmentLines', 'shipmentServiceLines'],
    });

    if (!shipment) {
      throw new NotFoundException(
        `Shipment with id: ${shipmentId} and status: false not found`,
      );
    }

    return await this.shipmentsRepository.remove(shipment);
  }

  async changeShipmentStatus(shipmentId: number): Promise<Shipment> {
    const shipment = await this.shipmentsRepository.findOne({
      where: { id: shipmentId },
      relations: ['shipmentLines'],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with id: ${shipmentId} not found`);
    }

    shipment.status = !shipment.status;

    await this.updateWarehouseAccounting(shipment);
    await this.updateTransitLines(shipment);

    return await this.shipmentsRepository.save(shipment);
  }

  private async updateWarehouseAccounting(shipment: Shipment): Promise<void> {
    const warehousePromises = shipment.shipmentLines.map((line) => {
      if (!shipment.status) {
        return this.warehouseService.decreaseShipGoodsCount({
          companyId: shipment.sellerId,
          warehouseId: shipment.sellerWarehouseId,
          batchId: line.batchId,
          packageId: line.packageId,
          qty: line.qty,
        });
      } else {
        return this.warehouseService.returnShipGoodsCount({
          companyId: shipment.sellerId,
          warehouseId: shipment.sellerWarehouseId,
          batchId: line.batchId,
          packageId: line.packageId,
          qty: line.qty,
        });
      }
    });

    await Promise.all(warehousePromises);
  }

  private async updateTransitLines(shipment: Shipment): Promise<void> {
    if (shipment.status) {
      await this.transitService.createTransitLine({
        shipmentId: shipment.id,
        lines: shipment.shipmentLines,
      });
    } else {
      await this.transitService.removeTransitLines(shipment.id);
    }
  }
}
