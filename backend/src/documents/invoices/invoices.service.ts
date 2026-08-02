import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { CompaniesService } from '../../companies';
import { CompanyType } from '../../companies/enums';
import { GoodsService } from '../../goods';
import { OrdersService } from '../orders';
import { PaymentService } from '../payment';
import { ReceiveService } from '../receive';
import { ShipmentService } from '../shipment';
import { WarehouseService } from '../../warehouse';

import {
  getProductIdsFromProductLines,
  getServiceIdsFromServiceLines,
} from '../../common/utils';

import { Invoice, InvoiceLine, InvoiceServiceLine } from './entities';
import {
  CreateInvoiceByContractDTO,
  CreateInvoiceDTO,
  CreateInvoiceLineDTO,
  GetTechnicalProcessesDataDTO,
  UpdateInvoiceDTO,
  UpdatePaymentBalanceDTO,
} from './dto';

import { CreateOrderDTO, CreateOrderLineDTO } from '../orders/dto';
import { CreateReveiveDTO } from '../receive/dto';
import { CreateShipmentDTO } from '../shipment/dto';
import {
  GetInvoiceResponseDTO,
  ShipReceiveResponseDTO,
} from './dto/response-dto';
import { GetInvoicesQueryDTO } from './dto/query-dto';
import { DocumentTypeEnum } from '../common/enums';
import { MONTHS_BY_QUATER, OLD_RECORDS_LIMIT } from '../common/constants';
import { Shipment } from '../shipment/entities';
import { Receive } from '../receive/entities';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectDataSource() private dataSource: DataSource,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentsService: PaymentService,
    private readonly companiesService: CompaniesService,
    private readonly goodsService: GoodsService,
    private readonly shipmentsService: ShipmentService,
    private readonly receiveService: ReceiveService,
    private readonly warehouseService: WarehouseService,
  ) { }

  private createBaseQueryBuilder(): SelectQueryBuilder<Invoice> {
    return this.invoiceRepository.createQueryBuilder('invoice');
  }

  private applyInvoiceListSelect(
    qb: SelectQueryBuilder<Invoice>,
  ): SelectQueryBuilder<Invoice> {
    return qb.leftJoin('invoice.parent', 'parent').select([
      'invoice.id',
      'invoice.invoiceNumber',
      'invoice.expectedDate',
      'invoice.sellerId',
      'invoice.buyerId',
      'invoice.recipientId',
      'invoice.status',
      'invoice.documentSum',
      'invoice.paymentBalance',
      'invoice.currencyId',
      'parent.id',
      'parent.invoiceNumber',
    ]);
  }

  private applyInvoiceDetailSelect(
    qb: SelectQueryBuilder<Invoice>,
  ): SelectQueryBuilder<Invoice> {
    return qb
      .leftJoin('invoice.parent', 'parent')
      .leftJoin('invoice.incoterms', 'incoterms')
      .leftJoin('invoice.invoiceLines', 'invoiceLine')
      .leftJoin('invoiceLine.batch', 'batch')
      .leftJoin('invoiceLine.order', 'order')
      .leftJoin('invoice.invoiceServiceLines', 'invoiceServiceLine')
      .select([
        'invoice.id',
        'invoice.invoiceNumber',
        'invoice.status',
        'invoice.expectedDate',
        'parent.id',
        'parent.invoiceNumber',
        'invoice.sellerId',
        'invoice.sellerWarehouseId',
        'invoice.buyerId',
        'invoice.buyerWarehouseId',
        'invoice.recipientId',
        'invoice.recipientWarehouseId',
        'invoice.paymentBalance',
        'invoice.currencyId',
        'invoice.paymentDelay',
        'invoice.incotermsId',
        'incoterms.name',
        'invoice.transportPlace',
        'invoice.carPlate',
        'invoice.vat',
        'invoice.ponz',
        'invoice.grossWeight',
        'invoice.transportAmount',
        'invoice.separation',
        'invoice.reportPeriod',
        'invoice.reportDuplicating',
        'invoice.contractInfo',
        'invoice.comment',
        'invoiceLine.id',
        'invoiceLine.productId',
        'invoiceLine.batchId',
        'invoiceLine.orderId',
        'invoiceLine.packageId',
        'invoiceLine.qty',
        'invoiceLine.price',
        'invoiceLine.cost',
        'invoiceLine.palletsQty',
        'invoiceLine.grossWeight',
        'invoiceLine.countryOfOriginId',
        'batch.id',
        'batch.name',
        'order.id',
        'order.orderNumber',
        'invoiceServiceLine.id',
        'invoiceServiceLine.serviceId',
        'invoiceServiceLine.qty',
        'invoiceServiceLine.price',
      ]);
  }

  private applyQueryFilter(
    qb: SelectQueryBuilder<Invoice>,
    query?: GetInvoicesQueryDTO,
  ): SelectQueryBuilder<Invoice> {
    if (!query || Object.keys(query).length === 0) {
      return qb; // Return the query builder unmodified if query is empty
    }

    if (query.company) {
      if (query.type) {
        if (query.type === DocumentTypeEnum.BUYER) {
          qb.andWhere('invoice.buyerId = :companyId', {
            companyId: query.company,
          });
        } else if (query.type === DocumentTypeEnum.SELLER) {
          qb.andWhere('invoice.sellerId = :companyId', {
            companyId: query.company,
          });
        }
      } else {
        qb.andWhere(
          new Brackets((subQb) => {
            subQb
              .where('invoice.sellerId = :companyId', {
                companyId: query.company,
              })
              .orWhere('invoice.buyerId = :companyId', {
                companyId: query.company,
              });
          }),
        );
      }
    }

    // query.date have formet YYYY-Q or "old"
    if (query.date) {
      if (query.date === 'old') {
        qb.andWhere('EXTRACT(YEAR FROM invoice.expectedDate) < :maxYear', {
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

        qb.andWhere('invoice.expectedDate BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }
    }

    if (query.is_ship) {
      qb.leftJoin('invoice.shipments', 'shipment');
      if (query.is_ship === 'true') {
        qb.andWhere('shipment.status = true');
      } else {
        qb.andWhere(
          new Brackets((subQb) => {
            subQb
              .where('shipment.id IS NULL')
              .orWhere(
                `NOT EXISTS (SELECT 1 FROM documents_shipment s WHERE s.invoice_id = invoice.id AND s.status = true)`,
              );
          }),
        );
      }
    }

    return qb;
  }

  async getInvoices(query?: GetInvoicesQueryDTO): Promise<Invoice[]> {
    const qb = this.createBaseQueryBuilder();

    this.applyInvoiceListSelect(qb);
    this.applyQueryFilter(qb, query);

    return qb.orderBy('invoice.id', 'DESC').getMany();
  }

  async getInvoiceById(invoiceId: number): Promise<GetInvoiceResponseDTO> {
    const qb = this.createBaseQueryBuilder();

    this.applyInvoiceDetailSelect(qb);

    const invoice = await qb
      .where('invoice.id = :invoiceId', { invoiceId })
      .getOne();

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    invoice['shipments'] =
      await this.shipmentsService.getShipmentsByInvoiceId(invoiceId);
    invoice['canFastShipReceive'] =
      await this.checkCanFastShipReceive(invoice);

    return { invoice };
  }

  private async checkCanFastShipReceive(invoice: Invoice): Promise<boolean> {
    if (!invoice.status) {
      return false;
    }

    const [sellerType, buyerType] = await Promise.all([
      this.companiesService.getCompanyType(invoice.sellerId),
      this.companiesService.getCompanyType(invoice.buyerId),
    ]);

    if (
      sellerType !== CompanyType.INNER_COMPANY ||
      buyerType !== CompanyType.INNER_COMPANY
    ) {
      return false;
    }

    const lines = invoice.invoiceLines ?? [];

    for (const line of lines) {
      const hasEnough = await this.warehouseService.hasEnoughQty({
        companyId: invoice.sellerId,
        warehouseId: invoice.sellerWarehouseId,
        batchId: line.batchId,
        packageId: line.packageId,
        qty: line.qty,
      });

      if (!hasEnough) {
        return false;
      }
    }

    return true;
  }

  async shipReceive(invoiceId: number): Promise<ShipReceiveResponseDTO> {
    const invoice = await this.getInvoiceEntityForShipReceive(invoiceId);

    if (!invoice.status) {
      throw new BadRequestException('Invoice must be posted');
    }

    const canFastShipReceive = await this.checkCanFastShipReceive(invoice);
    if (!canFastShipReceive) {
      throw new BadRequestException('Fast ship/receive is not possible');
    }

    if (!invoice.incotermsId) {
      throw new BadRequestException('Invoice incoterms is required');
    }

    if (!invoice.buyerWarehouseId) {
      throw new BadRequestException('Invoice buyer warehouse is required');
    }

    let shipment: Shipment | undefined;
    let receive: Receive | undefined;
    let shipPosted = false;
    let recvPosted = false;

    try {
      shipment = await this.shipmentsService.createShipment(
        this.buildCreateShipmentDto(invoice),
      );
      await this.shipmentsService.changeShipmentStatus(shipment.id);
      shipPosted = true;

      receive = await this.receiveService.createReceive(
        this.buildCreateReceiveDto(invoice, shipment.id),
      );
      await this.receiveService.changeReceiveStatus(receive.id);
      recvPosted = true;

      return { receiveId: receive.id, shipmentId: shipment.id };
    } catch (err) {
      try {
        if (receive?.id && recvPosted) {
          await this.receiveService.changeReceiveStatus(receive.id);
          recvPosted = false;
        }
        if (shipment?.id && shipPosted) {
          await this.shipmentsService.changeShipmentStatus(shipment.id);
          shipPosted = false;
        }
        if (receive?.id) {
          await this.receiveService.removeReceive(receive.id);
        }
        if (shipment?.id) {
          await this.shipmentsService.removeShipment(shipment.id);
        }
      } catch (compensationErr) {
        this.logger.error(
          `shipReceive compensation failed for invoice ${invoiceId}`,
          compensationErr instanceof Error
            ? compensationErr.stack
            : String(compensationErr),
        );
        throw new InternalServerErrorException(
          'Fast ship/receive failed and compensation could not complete',
          { cause: err },
        );
      }

      throw err;
    }
  }

  private async getInvoiceEntityForShipReceive(
    invoiceId: number,
  ): Promise<Invoice> {
    const qb = this.createBaseQueryBuilder();
    this.applyInvoiceDetailSelect(qb);

    const invoice = await qb
      .where('invoice.id = :invoiceId', { invoiceId })
      .getOne();

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    return invoice;
  }

  private buildCreateShipmentDto(invoice: Invoice): CreateShipmentDTO {
    return {
      sellerId: invoice.sellerId,
      sellerWarehouseId: invoice.sellerWarehouseId,
      buyerId: invoice.buyerId,
      currencyId: invoice.currencyId,
      invoiceId: invoice.id,
      expectedDate: invoice.expectedDate || new Date(),
      incotermsId: invoice.incotermsId,
      transportPlace: invoice.transportPlace || '',
      transportAmount: invoice.transportAmount || 0,
      comment: '',
      shipmentLines: (invoice.invoiceLines ?? []).map((line) => ({
        productId: line.productId,
        batchId: line.batchId,
        packageId: line.packageId,
        qty: line.qty,
        price: line.price,
      })),
      shipmentServiceLines: (invoice.invoiceServiceLines ?? []).map((line) => ({
        serviceId: line.serviceId,
        qty: line.qty,
        price: line.price,
      })),
    };
  }

  private buildCreateReceiveDto(
    invoice: Invoice,
    shipmentId: number,
  ): CreateReveiveDTO {
    return {
      sellerId: invoice.sellerId,
      buyerId: invoice.buyerId,
      buyerWarehouseId: invoice.buyerWarehouseId,
      currencyId: invoice.currencyId,
      shipmentId,
      expectedDate: invoice.expectedDate || new Date(),
      incotermsId: invoice.incotermsId,
      transportPlace: invoice.transportPlace || '',
      transportAmount: invoice.transportAmount || 0,
      comment: '',
      receiveLines: (invoice.invoiceLines ?? []).map((line) => ({
        productId: line.productId,
        batchId: line.batchId,
        packageId: line.packageId,
        qty: line.qty,
        price: line.price,
      })),
      receiveServiceLines: (invoice.invoiceServiceLines ?? []).map((line) => ({
        serviceId: line.serviceId,
        qty: line.qty,
        price: line.price,
      })),
    };
  }

  async getInvoicesByOrderId(orderId: number): Promise<Invoice[]> {
    const invoices = await this.createBaseQueryBuilder()
      .where('invoiceLine.orderId = :orderId', { orderId })
      .select(['invoice.id', 'invoice.status', 'invoice.invoiceNumber'])
      .leftJoin('invoice.invoiceLines', 'invoiceLine')
      .orderBy('invoice.id', 'ASC')
      .getMany();

    await Promise.all(
      invoices.map(async (invoice) => {
        invoice['shipments'] =
          await this.shipmentsService.getShipmentsByInvoiceId(invoice.id);
        invoice['payments'] = await this.paymentsService.getPaymentsByInvoiceId(
          invoice.id,
        );
      }),
    );

    return invoices;
  }

  async createInvoice(createInvoiceDTO: CreateInvoiceDTO): Promise<Invoice> {
    const { invoiceId, ...invoiceData } = createInvoiceDTO;
    const newInvoice = this.invoiceRepository.create(invoiceData);

    if (invoiceId) {
      newInvoice.parentId = invoiceId;
    }

    newInvoice.technicalProcesses =
      await this.getTechnicalProcesses(createInvoiceDTO);
    newInvoice.status = false;
    newInvoice.createdAt = new Date();
    newInvoice.reportPeriod = newInvoice.reportPeriod || newInvoice.createdAt;
    newInvoice.comment = newInvoice.comment || '';
    newInvoice.transportPlace = newInvoice.transportPlace || '';
    newInvoice.paymentDelay = newInvoice.paymentDelay || 0;
    newInvoice.vat = newInvoice.vat || 0;
    newInvoice.separation = newInvoice.separation || false;

    newInvoice.documentSum = this.calculateDocumentSum(createInvoiceDTO);
    newInvoice.paymentBalance = newInvoice.documentSum;
    newInvoice.invoiceLines = await this.populateLinesCosts(
      newInvoice.invoiceLines,
      newInvoice.sellerId,
      newInvoice.sellerWarehouseId,
      newInvoice.currencyId,
    );

    newInvoice.grossWeight = this.countInvoiceGrossWeight(
      newInvoice.invoiceLines,
    );

    return await this.invoiceRepository.save(newInvoice);
  }

  private calculateDocumentSum(invoiceData): number {
    return (
      invoiceData.invoiceLines.reduce(
        (acc: number, cur: InvoiceLine) => (acc += cur.price * cur.qty),
        0,
      ) +
      invoiceData.invoiceServiceLines.reduce(
        (acc: number, cur: InvoiceServiceLine) => (acc += cur.price * cur.qty),
        0,
      )
    );
  }

  private async getTechnicalProcesses(
    invoiceData: GetTechnicalProcessesDataDTO,
  ): Promise<{ id: number }[]> {
    const productIds = getProductIdsFromProductLines(invoiceData.invoiceLines);
    const productProcesses =
      await this.goodsService.getTechnicalProcessesFromProductIds(productIds);

    const serviceIds = getServiceIdsFromServiceLines(
      invoiceData.invoiceServiceLines,
    );
    const serviceProcesses =
      await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);

    const technicalProcesses = [
      ...new Set([...productProcesses, ...serviceProcesses]),
    ];

    return technicalProcesses.map((process) => ({ id: process.id }));
  }

  private async populateLinesCosts(
    invoiceLines: Partial<InvoiceLine>[],
    companyId: number,
    warehouseId: number,
    currencyId: number,
  ): Promise<Partial<InvoiceLine>[]> {
    await Promise.all(
      invoiceLines.map(async (line) => {
        if (!line.cost) {
          line.cost = await this.warehouseService.getWareCost({
            ...line,
            companyId,
            warehouseId,
            currencyId,
          });
        }
      }),
    );

    return invoiceLines;
  }

  async createInvoiceByContract(
    createInvoiceByContractDTO: CreateInvoiceByContractDTO,
  ): Promise<Invoice> {
    createInvoiceByContractDTO.transportAmount =
      createInvoiceByContractDTO.transportAmount || 0;

    const createOrderDto: CreateOrderDTO = {
      orderNumber: '',
      contractId: createInvoiceByContractDTO.contractId,
      sellerId: createInvoiceByContractDTO.sellerId,
      sellerWarehouseId: createInvoiceByContractDTO.sellerWarehouseId,
      buyerId: createInvoiceByContractDTO.buyerId,
      buyerWarehouseId: createInvoiceByContractDTO.buyerWarehouseId,
      recipientId: createInvoiceByContractDTO.recipientId,
      recipientWarehouseId: createInvoiceByContractDTO.recipientWarehouseId,
      expectedDate: createInvoiceByContractDTO.expectedDate || new Date(),
      isDateAsap: false,
      currencyId: createInvoiceByContractDTO.currencyId,
      vat: createInvoiceByContractDTO.vat,
      paymentDelay: createInvoiceByContractDTO.paymentDelay,
      incotermsId: createInvoiceByContractDTO.incotermsId,
      transportPlace: createInvoiceByContractDTO.transportPlace,
      orderLines: [],
      orderServiceLines: createInvoiceByContractDTO.invoiceServiceLines,
      isHidden: true,
    };

    createOrderDto.orderLines = createInvoiceByContractDTO.invoiceLines.map(
      (line: Partial<CreateOrderLineDTO> & { productId: number }) => {
        line.productManId = line.productId;
        line.productBuyId = line.productId;
        line.batchRename = '';

        return line as CreateOrderLineDTO;
      },
    );

    const order = await this.ordersService.createOrder(createOrderDto);
    delete createInvoiceByContractDTO.invoiceId;

    const createInvoiceDTO: CreateInvoiceDTO = {
      ...createInvoiceByContractDTO,
      invoiceLines: createInvoiceByContractDTO.invoiceLines.map(
        (line: Partial<CreateInvoiceLineDTO>) => {
          line.orderId = order.id;
          return line as CreateInvoiceLineDTO;
        },
      ),
    };

    return await this.createInvoice(createInvoiceDTO);
  }

  async updateInvoice(
    invoiceId: number,
    updateInvoiceDTO: UpdateInvoiceDTO,
  ): Promise<Invoice> {
    const invoice = await this.createBaseQueryBuilder()
      .where('invoice.id = :invoiceId', { invoiceId })
      .andWhere('invoice.status = FALSE')
      .leftJoinAndSelect('invoice.invoiceLines', 'invoiceLines')
      .leftJoinAndSelect('invoice.invoiceServiceLines', 'invoiceServiceLines')
      .leftJoinAndSelect('invoice.technicalProcesses', 'technicalProcesses')
      .getOne();

    if (!invoice) {
      throw new NotFoundException(
        `Invoice with id: ${invoiceId} and status: false not found`,
      );
    }

    const invoiceLines = updateInvoiceDTO.invoiceLines ?? [];
    const invoiceServiceLines = updateInvoiceDTO.invoiceServiceLines ?? [];

    const updatedInvoiceLinesIds = invoiceLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const invoiceLinesToDelete = invoice.invoiceLines.filter(
      (line) => !updatedInvoiceLinesIds.includes(line.id),
    );

    const updatedInvoiceServiceLinesIds = invoiceServiceLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const invoiceServiceLinesToDelete = invoice.invoiceServiceLines.filter(
      (line) => !updatedInvoiceServiceLinesIds.includes(line.id),
    );

    const updated = Object.assign(invoice, {
      ...updateInvoiceDTO,
      invoiceLines,
      invoiceServiceLines,
    }) as Invoice;

    updated.documentSum = this.calculateDocumentSum(updated);

    updated.technicalProcesses =
      await this.getTechnicalProcesses(updateInvoiceDTO);

    updated.invoiceLines = await this.populateLinesCosts(
      updated.invoiceLines,
      updated.sellerId,
      updated.sellerWarehouseId,
      updated.currencyId,
    );

    updated.grossWeight = this.countInvoiceGrossWeight(updated.invoiceLines);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (invoiceLinesToDelete.length) {
        await queryRunner.manager.remove(invoiceLinesToDelete);
      }

      if (invoiceServiceLinesToDelete.length) {
        await queryRunner.manager.remove(invoiceServiceLinesToDelete);
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

  async removeInvoice(invoiceId: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId, status: false },
      relations: ['invoiceLines', 'invoiceServiceLines'],
    });

    if (!invoice) {
      throw new NotFoundException(
        `Invoice with id: ${invoiceId} and status: false not found`,
      );
    }

    return await this.invoiceRepository.remove(invoice);
  }

  async changeInvoiceStatus(invoiceId: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with id: ${invoiceId} not found`);
    }

    invoice.status = !invoice.status;

    await this.companiesService.changeInvoiceStatusBalances({
      sellerId: invoice.sellerId,
      buyerId: invoice.buyerId,
      currencyId: invoice.currencyId,
      status: invoice.status,
      amount: invoice.documentSum,
    });

    return await this.invoiceRepository.save(invoice);
  }

  async getInvoiceDataForCommission(invoiceId: number): Promise<Invoice> {
    const invoice = await this.createBaseQueryBuilder()
      .where('invoice.id = :invoiceId', { invoiceId })
      .andWhere('invoice.status = true')
      .leftJoin('invoice.children', 'children')
      .leftJoin('invoice.technicalProcesses', 'technicalProcess')
      .andWhere('children.status = true')
      .select([
        'invoice.id',
        'invoice.invoiceNumber',
        'invoice.documentSum',
        'children.id',
        'children.invoiceNumber',
        'children.documentSum',
        'technicalProcess.id',
      ])
      .getOne();

    return invoice;
  }

  private countInvoiceGrossWeight(
    invoiceLines: Partial<InvoiceLine>[],
  ): number {
    let totalGrossWeight = 0;
    for (const line of invoiceLines) {
      if (line.grossWeight) {
        totalGrossWeight += line.grossWeight;
      }
    }
    return totalGrossWeight;
  }

  async changePaymentBalance(
    updateBalanceDTO: UpdatePaymentBalanceDTO,
  ): Promise<void> {
    const changeBalanceData = updateBalanceDTO.paymentLines.reduce(
      (acc, cur) => {
        if (!acc[cur.invoiceId]) {
          acc[cur.invoiceId] = cur.amount;
        } else {
          acc[cur.invoiceId] += cur.amount;
        }
        return acc;
      },
      {},
    );

    const invoices = await this.createBaseQueryBuilder()
      .where('invoice.id IN (:...invoiceIds)', {
        invoiceIds: Object.keys(changeBalanceData),
      })
      .getMany();

    if (updateBalanceDTO.status) {
      invoices.forEach(
        (invoice) => (invoice.paymentBalance -= changeBalanceData[invoice.id]),
      );
    } else {
      invoices.forEach(
        (invoice) => (invoice.paymentBalance += changeBalanceData[invoice.id]),
      );
    }

    await this.invoiceRepository.save(invoices);
  }
}
