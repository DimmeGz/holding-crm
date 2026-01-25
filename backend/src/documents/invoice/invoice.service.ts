import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { CompaniesService } from '../../companies';
import { GoodsService } from '../../goods';
import { OrdersService } from '../orders';
import { PaymentService } from '../payment';
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
import { GetInvoiceResponseDTO } from './dto/response-dto';
import { GetInvoicesQueryDTO } from './dto/query-dto';
import { DocumentTypeEnum } from '../common/enums';
import { MONTHS_BY_QUATER, OLD_RECORDS_LIMIT } from '../common/constants';

@Injectable()
export class InvoiceService {
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
    private readonly warehouseService: WarehouseService,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<Invoice> {
    return this.invoiceRepository.createQueryBuilder('invoice');
  }

  private applyInvoiceListSelect(
    qb: SelectQueryBuilder<Invoice>,
  ): SelectQueryBuilder<Invoice> {
    return qb
      .leftJoin('invoice.seller', 'seller')
      .leftJoin('invoice.buyer', 'buyer')
      .leftJoin('invoice.recipient', 'recipient')
      .leftJoin('invoice.parent', 'parent')
      .select([
        'invoice.id',
        'invoice.number',
        'seller.id',
        'seller.name',
        'buyer.id',
        'buyer.name',
        'recipient.id',
        'recipient.name',
        'invoice.status',
        'invoice.documentSum',
        'parent.id',
        'parent.number',
      ]);
  }

  private applyInvoiceDetailSelect(
    qb: SelectQueryBuilder<Invoice>,
  ): SelectQueryBuilder<Invoice> {
    return qb
      .leftJoin('invoice.seller', 'seller')
      .leftJoin('invoice.sellerWarehouse', 'sellerWarehouse')
      .leftJoin('invoice.buyer', 'buyer')
      .leftJoin('invoice.buyerWarehouse', 'buyerWarehouse')
      .leftJoin('invoice.recipient', 'recipient')
      .leftJoin('invoice.recipientWarehouse', 'recipientWarehouse')
      .leftJoin('invoice.parent', 'parent')
      .leftJoin('invoice.currency', 'currency')
      .leftJoin('invoice.invoiceLines', 'invoiceLine')
      .leftJoin('invoiceLine.product', 'product')
      .leftJoin('invoiceLine.batch', 'batch')
      .leftJoin('invoiceLine.countryOfOrigin', 'countryOfOrigin')
      .leftJoin('invoiceLine.package', 'package')
      .leftJoin('invoice.commissionInvoices', 'commissionInvoice')
      .leftJoin('commissionInvoice.commissionPayments', 'commissionPayment')
      .leftJoin('invoice.children', 'children')
      .select([
        'invoice.invoiceNumber',
        'invoice.status',
        'invoice.expectedDate',
        'invoice.paymentBalance',
        'parent.id',
        'parent.invoiceNumber',
        'seller.name',
        'sellerWarehouse.name',
        'buyer.name',
        'buyerWarehouse.name',
        'recipient.name',
        'recipientWarehouse.name',
        'currency.name',
        'invoice.vat',
        'invoice.paymentDelay',
        'invoice.incoterms',
        'invoice.transportPlace',
        'invoice.ponz',
        'invoice.grossWeight',
        'invoice.transportAmount',
        'invoice.comment',
        'invoice.separation',
        'invoice.reportPeriod',
        'invoice.contractInfo',
        'invoiceLine',
        'product.name',
        'batch.id',
        'batch.name',
        'countryOfOrigin.name',
        'package.name',
        'package.capacity',
        'commissionInvoice.id',
        'commissionInvoice.status',
        'commissionPayment.id',
        'commissionPayment.status',
        'children.id',
        'children.status',
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
    return await this.applyQueryFilter(
      this.applyInvoiceListSelect(this.createBaseQueryBuilder()),
      query,
    )
      .orderBy('invoice.id', 'DESC')
      .getMany();
  }

  async getInvoiceById(invoiceId: number): Promise<GetInvoiceResponseDTO> {
    const invoice = await this.applyInvoiceDetailSelect(
      this.createBaseQueryBuilder(),
    )
      .where('invoice.id = :invoiceId', { invoiceId })
      .getOne();

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    const shipments =
      await this.shipmentsService.getShipmentsByInvoiceId(invoiceId);
    const payments =
      await this.paymentsService.getPaymentsByInvoiceId(invoiceId);
    const commissions = invoice.commissionInvoices;
    delete invoice.commissionInvoices;
    const childInvoices = invoice.children;
    delete invoice.children;

    return { invoice, shipments, payments, commissions, childInvoices };
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
    const newInvoice = this.invoiceRepository.create(createInvoiceDTO);

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

    const updatedInvoiceLinesIds = updateInvoiceDTO.invoiceLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const invoiceLinesToDelete = invoice.invoiceLines.filter(
      (line) => !updatedInvoiceLinesIds.includes(line.id),
    );

    const updatedInvoiceServiceLinesIds = updateInvoiceDTO.invoiceServiceLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const invoiceServiceLinesToDelete = invoice.invoiceServiceLines.filter(
      (line) => !updatedInvoiceServiceLinesIds.includes(line.id),
    );

    const updated = Object.assign(invoice, updateInvoiceDTO) as Invoice;

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
