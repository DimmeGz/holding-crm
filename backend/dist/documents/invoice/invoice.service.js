"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const companies_1 = require("../../companies");
const goods_1 = require("../../goods");
const orders_1 = require("../orders");
const payment_1 = require("../payment");
const shipment_1 = require("../shipment");
const warehouse_1 = require("../../warehouse");
const utils_1 = require("../../common/utils");
const entities_1 = require("./entities");
const enums_1 = require("../common/enums");
const constants_1 = require("../common/constants");
let InvoiceService = class InvoiceService {
    constructor(invoiceRepository, dataSource, ordersService, paymentsService, companiesService, goodsService, shipmentsService, warehouseService) {
        this.invoiceRepository = invoiceRepository;
        this.dataSource = dataSource;
        this.ordersService = ordersService;
        this.paymentsService = paymentsService;
        this.companiesService = companiesService;
        this.goodsService = goodsService;
        this.shipmentsService = shipmentsService;
        this.warehouseService = warehouseService;
    }
    createBaseQueryBuilder() {
        return this.invoiceRepository.createQueryBuilder('invoice');
    }
    applyInvoiceListSelect(qb) {
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
    applyInvoiceDetailSelect(qb) {
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
    applyQueryFilter(qb, query) {
        if (!query || Object.keys(query).length === 0) {
            return qb;
        }
        if (query.company) {
            if (query.type) {
                if (query.type === enums_1.DocumentTypeEnum.BUYER) {
                    qb.andWhere('invoice.buyerId = :companyId', {
                        companyId: query.company,
                    });
                }
                else if (query.type === enums_1.DocumentTypeEnum.SELLER) {
                    qb.andWhere('invoice.sellerId = :companyId', {
                        companyId: query.company,
                    });
                }
            }
            else {
                qb.andWhere(new typeorm_2.Brackets((subQb) => {
                    subQb
                        .where('invoice.sellerId = :companyId', {
                        companyId: query.company,
                    })
                        .orWhere('invoice.buyerId = :companyId', {
                        companyId: query.company,
                    });
                }));
            }
        }
        if (query.date) {
            if (query.date === 'old') {
                qb.andWhere('EXTRACT(YEAR FROM invoice.expectedDate) < :maxYear', {
                    maxYear: constants_1.OLD_RECORDS_LIMIT,
                });
            }
            else {
                const [year, quarter] = query.date.split('-');
                const startDate = new Date(+year, constants_1.MONTHS_BY_QUATER[quarter].start - 1, 1);
                const endDate = new Date(+year, constants_1.MONTHS_BY_QUATER[quarter].end);
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
            }
            else {
                qb.andWhere(new typeorm_2.Brackets((subQb) => {
                    subQb
                        .where('shipment.id IS NULL')
                        .orWhere(`NOT EXISTS (SELECT 1 FROM documents_shipment s WHERE s.invoice_id = invoice.id AND s.status = true)`);
                }));
            }
        }
        return qb;
    }
    async getInvoices(query) {
        return await this.applyQueryFilter(this.applyInvoiceListSelect(this.createBaseQueryBuilder()), query)
            .orderBy('invoice.id', 'DESC')
            .getMany();
    }
    async getInvoiceById(invoiceId) {
        const invoice = await this.applyInvoiceDetailSelect(this.createBaseQueryBuilder())
            .where('invoice.id = :invoiceId', { invoiceId })
            .getOne();
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${invoiceId} not found`);
        }
        const shipments = await this.shipmentsService.getShipmentsByInvoiceId(invoiceId);
        const payments = await this.paymentsService.getPaymentsByInvoiceId(invoiceId);
        const commissions = invoice.commissionInvoices;
        delete invoice.commissionInvoices;
        const childInvoices = invoice.children;
        delete invoice.children;
        return { invoice, shipments, payments, commissions, childInvoices };
    }
    async getInvoicesByOrderId(orderId) {
        const invoices = await this.createBaseQueryBuilder()
            .where('invoiceLine.orderId = :orderId', { orderId })
            .select(['invoice.id', 'invoice.status', 'invoice.invoiceNumber'])
            .leftJoinAndSelect('invoice.invoiceLines', 'invoiceLine')
            .orderBy('invoice.id', 'ASC')
            .getMany();
        await Promise.all(invoices.map(async (invoice) => {
            invoice['shipments'] =
                await this.shipmentsService.getShipmentsByInvoiceId(invoice.id);
            invoice['payments'] = await this.paymentsService.getPaymentsByInvoiceId(invoice.id);
        }));
        return invoices;
    }
    async createInvoice(createInvoiceDTO) {
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
        newInvoice.invoiceLines = await this.populateLinesCosts(newInvoice.invoiceLines, newInvoice.sellerId, newInvoice.sellerWarehouseId, newInvoice.currencyId);
        newInvoice.grossWeight = this.countInvoiceGrossWeight(newInvoice.invoiceLines);
        return await this.invoiceRepository.save(newInvoice);
    }
    calculateDocumentSum(invoiceData) {
        return (invoiceData.invoiceLines.reduce((acc, cur) => (acc += cur.price * cur.qty), 0) +
            invoiceData.invoiceServiceLines.reduce((acc, cur) => (acc += cur.price * cur.qty), 0));
    }
    async getTechnicalProcesses(invoiceData) {
        const productIds = (0, utils_1.getProductIdsFromProductLines)(invoiceData.invoiceLines);
        const productProcesses = await this.goodsService.getTechnicalProcessesFromProductIds(productIds);
        const serviceIds = (0, utils_1.getServiceIdsFromServiceLines)(invoiceData.invoiceServiceLines);
        const serviceProcesses = await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);
        const technicalProcesses = [
            ...new Set([...productProcesses, ...serviceProcesses]),
        ];
        return technicalProcesses.map((process) => ({ id: process.id }));
    }
    async populateLinesCosts(invoiceLines, companyId, warehouseId, currencyId) {
        await Promise.all(invoiceLines.map(async (line) => {
            if (!line.cost) {
                line.cost = await this.warehouseService.getWareCost({
                    ...line,
                    companyId,
                    warehouseId,
                    currencyId,
                });
            }
        }));
        return invoiceLines;
    }
    async createInvoiceByContract(createInvoiceByContractDTO) {
        createInvoiceByContractDTO.transportAmount =
            createInvoiceByContractDTO.transportAmount || 0;
        const createOrderDto = {
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
        createOrderDto.orderLines = createInvoiceByContractDTO.invoiceLines.map((line) => {
            line.productManId = line.productId;
            line.productBuyId = line.productId;
            line.batchRename = '';
            return line;
        });
        const order = await this.ordersService.createOrder(createOrderDto);
        delete createInvoiceByContractDTO.invoiceId;
        const createInvoiceDTO = {
            ...createInvoiceByContractDTO,
            invoiceLines: createInvoiceByContractDTO.invoiceLines.map((line) => {
                line.orderId = order.id;
                return line;
            }),
        };
        return await this.createInvoice(createInvoiceDTO);
    }
    async updateInvoice(invoiceId, updateInvoiceDTO) {
        const invoice = await this.createBaseQueryBuilder()
            .where('invoice.id = :invoiceId', { invoiceId })
            .andWhere('invoice.status = FALSE')
            .leftJoinAndSelect('invoice.invoiceLines', 'invoiceLines')
            .leftJoinAndSelect('invoice.invoiceServiceLines', 'invoiceServiceLines')
            .leftJoinAndSelect('invoice.technicalProcesses', 'technicalProcesses')
            .getOne();
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with id: ${invoiceId} and status: false not found`);
        }
        const updatedInvoiceLinesIds = updateInvoiceDTO.invoiceLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const invoiceLinesToDelete = invoice.invoiceLines.filter((line) => !updatedInvoiceLinesIds.includes(line.id));
        const updatedInvoiceServiceLinesIds = updateInvoiceDTO.invoiceServiceLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const invoiceServiceLinesToDelete = invoice.invoiceServiceLines.filter((line) => !updatedInvoiceServiceLinesIds.includes(line.id));
        const updated = Object.assign(invoice, updateInvoiceDTO);
        updated.documentSum = this.calculateDocumentSum(updated);
        updated.technicalProcesses =
            await this.getTechnicalProcesses(updateInvoiceDTO);
        updated.invoiceLines = await this.populateLinesCosts(updated.invoiceLines, updated.sellerId, updated.sellerWarehouseId, updated.currencyId);
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
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException();
        }
        finally {
            await queryRunner.release();
        }
    }
    async removeInvoice(invoiceId) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoiceId, status: false },
            relations: ['invoiceLines', 'invoiceServiceLines'],
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with id: ${invoiceId} and status: false not found`);
        }
        return await this.invoiceRepository.remove(invoice);
    }
    async changeInvoiceStatus(invoiceId) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoiceId },
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with id: ${invoiceId} not found`);
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
    async getInvoiceDataForCommission(invoiceId) {
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
    countInvoiceGrossWeight(invoiceLines) {
        let totalGrossWeight = 0;
        for (const line of invoiceLines) {
            if (line.grossWeight) {
                totalGrossWeight += line.grossWeight;
            }
        }
        return totalGrossWeight;
    }
    async changePaymentBalance(updateBalanceDTO) {
        const changeBalanceData = updateBalanceDTO.paymentLines.reduce((acc, cur) => {
            if (!acc[cur.invoiceId]) {
                acc[cur.invoiceId] = cur.amount;
            }
            else {
                acc[cur.invoiceId] += cur.amount;
            }
            return acc;
        }, {});
        const invoices = await this.createBaseQueryBuilder()
            .where('invoice.id IN (:...invoiceIds)', {
            invoiceIds: Object.keys(changeBalanceData),
        })
            .getMany();
        if (updateBalanceDTO.status) {
            invoices.forEach((invoice) => (invoice.paymentBalance -= changeBalanceData[invoice.id]));
        }
        else {
            invoices.forEach((invoice) => (invoice.paymentBalance += changeBalanceData[invoice.id]));
        }
        await this.invoiceRepository.save(invoices);
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Invoice)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => orders_1.OrdersService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => payment_1.PaymentService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        orders_1.OrdersService,
        payment_1.PaymentService,
        companies_1.CompaniesService,
        goods_1.GoodsService,
        shipment_1.ShipmentService,
        warehouse_1.WarehouseService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map