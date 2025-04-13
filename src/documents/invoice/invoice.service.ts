import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

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

import { Invoice, InvoiceLine } from './entities';
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

  async getInvoices(): Promise<Invoice[]> {
    const invoices = await this.invoiceRepository
      .createQueryBuilder('invoice')
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
      ])
      .orderBy('invoice.id', 'DESC')
      .getMany();

    return invoices;
  }

  async getInvoiceById(invoiceId: number): Promise<GetInvoiceResponseDTO> {
    const invoice = await this.invoiceRepository
      .createQueryBuilder('invoice')
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
      .where('invoice.id = :invoiceId', { invoiceId })
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
      ])
      .leftJoin('invoice.commissionInvoices', 'commissionInvoice')
      .leftJoin('commissionInvoice.commissionPayments', 'commissionPayment')
      .leftJoin('invoice.children', 'children')
      .addSelect([
        'commissionInvoice.id',
        'commissionInvoice.status',
        'commissionPayment.id',
        'commissionPayment.status',
        'children.id',
        'children.status',
      ])
      .getOne();

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
    const invoices = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .where('invoiceLine.orderId = :orderId', { orderId })
      .select(['invoice.id', 'invoice.status', 'invoice.invoiceNumber'])
      .leftJoinAndSelect('invoice.invoiceLines', 'invoiceLine')
      .orderBy('invoice.id', 'ASC')
      .getMany();

    for await (const invoice of invoices) {
      invoice['shipments'] =
        await this.shipmentsService.getShipmentsByInvoiceId(invoice.id);
      invoice['payments'] = await this.paymentsService.getPaymentsByInvoiceId(
        invoice.id,
      );
    }

    return invoices;
  }

  async createInvoice(createInvoiceDTO: CreateInvoiceDTO): Promise<Invoice> {
    createInvoiceDTO['technicalProcesses'] =
      await this.getTechnicalProcesses(createInvoiceDTO);
    const newInvoice = new Invoice(createInvoiceDTO);

    newInvoice.status = false;
    newInvoice.createdAt = new Date();
    newInvoice.reportPeriod = newInvoice.reportPeriod || newInvoice.createdAt;
    newInvoice.comment = newInvoice.comment || '';
    newInvoice.transportPlace = newInvoice.transportPlace || '';
    newInvoice.paymentDelay = newInvoice.paymentDelay || 0;
    newInvoice.vat = newInvoice.vat || 0;
    newInvoice.separation = newInvoice.separation || false;

    newInvoice.documentSum =
      createInvoiceDTO.invoiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      ) +
      createInvoiceDTO.invoiceServiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      );
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
    for await (const line of invoiceLines) {
      if (!line.cost) {
        line.cost = await this.warehouseService.getWareCost({
          ...line,
          companyId,
          warehouseId,
          currencyId,
        });
      }
    }

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
    const invoice = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .where('invoice.id = :invoiceId', { invoiceId })
      .andWhere('invoice.status = FALSE')
      .leftJoinAndSelect('invoice.invoiceLines', 'invoiceLines')
      .leftJoinAndSelect('invoice.invoiceServiceLines', 'invoiceServiceLines')
      .leftJoinAndSelect('invoice.technicalProcesses', 'technicalProcesses')
      .getOne();

    const updatedInvoiceLinesIds = [];
    for (const line of updateInvoiceDTO.invoiceLines) {
      if (line['id']) {
        updatedInvoiceLinesIds.push(line['id']);
      }
    }
    const invoiceLinesToDelete = invoice.invoiceLines.filter(
      (line) => !updatedInvoiceLinesIds.includes(line.id),
    );

    const updatedInvoiceServiceLinesIds = [];
    for (const line of updateInvoiceDTO.invoiceServiceLines) {
      if (line['id']) {
        updatedInvoiceServiceLinesIds.push(line['id']);
      }
    }
    const invoiceServiceLinesToDelete = invoice.invoiceServiceLines.filter(
      (line) => !updatedInvoiceServiceLinesIds.includes(line.id),
    );

    updateInvoiceDTO.grossWeight = this.countInvoiceGrossWeight(
      updateInvoiceDTO.invoiceLines,
    );

    const updated = Object.assign(invoice, updateInvoiceDTO) as Invoice;

    updated.documentSum =
      updated.invoiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      ) +
      updated.invoiceServiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      );

    updated.technicalProcesses =
      await this.getTechnicalProcesses(updateInvoiceDTO);

    updated.invoiceLines = await this.populateLinesCosts(
      updated.invoiceLines,
      updated.sellerId,
      updated.sellerWarehouseId,
      updated.currencyId,
    );

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
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id: invoiceId, status: false },
        relations: ['invoiceLines', 'invoiceServiceLines'],
      });
      return await this.invoiceRepository.remove(invoice);
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async changeInvoiceStatus(invoiceId: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

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
    const invoice = await this.invoiceRepository
      .createQueryBuilder('invoice')
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

    const invoices = await this.invoiceRepository
      .createQueryBuilder('invoice')
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
