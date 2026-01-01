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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contracts_1 = require("../contracts");
const goods_1 = require("../../goods");
const invoice_1 = require("../invoice");
const orders_confirmation_1 = require("../orders-confirmation");
const utils_1 = require("../../common/utils");
const entities_1 = require("./entities");
const enums_1 = require("../../companies/enums");
const enums_2 = require("../common/enums");
let OrdersService = class OrdersService {
    constructor(ordersRepository, dataSource, contractsService, invoiceService, goodsService, orderConfirmationsService) {
        this.ordersRepository = ordersRepository;
        this.dataSource = dataSource;
        this.contractsService = contractsService;
        this.invoiceService = invoiceService;
        this.goodsService = goodsService;
        this.orderConfirmationsService = orderConfirmationsService;
    }
    createBaseQueryBuilder() {
        return this.ordersRepository.createQueryBuilder('order');
    }
    applyOrderListSelect(qb) {
        return qb
            .leftJoin('order.seller', 'seller')
            .leftJoin('order.buyer', 'buyer')
            .leftJoin('order.recipient', 'recipient')
            .leftJoin('order.contract', 'contract')
            .leftJoin('order.orderLines', 'orderLine')
            .leftJoin('orderLine.productMan', 'product')
            .leftJoin('order.orderConfirmations', 'orderConfirmation')
            .select([
            'order.id',
            'order.documentSum',
            'seller.name',
            'buyer.name',
            'recipient.name',
            'contract.name',
            'orderLine.id',
            'product.name',
            'orderConfirmation.id',
            'orderConfirmation.expectedDate',
        ]);
    }
    applyQueryFilter(qb, query) {
        if (!query || Object.keys(query).length === 0) {
            return qb;
        }
        if (query.status) {
            qb.andWhere('order.status = :orderStatus', { orderStatus: query.status });
        }
        if (query.process) {
            qb.leftJoin('order.technicalProcesses', 'technicalProcess').andWhere('technicalProcess.id = :processId', {
                processId: query.process,
            });
        }
        if (query.type) {
            if (query.type === enums_2.DocumentTypeEnum.SELLER) {
                qb.andWhere('seller.companyType = :companyType', {
                    companyType: enums_1.CompanyType.INNER_COMPANY,
                });
            }
            else {
                qb.andWhere('buyer.companyType = :companyType', {
                    companyType: enums_1.CompanyType.INNER_COMPANY,
                });
            }
        }
        if (query.year) {
            qb.andWhere('EXTRACT(YEAR FROM order.expectedDate) = :year', {
                year: query.year,
            });
        }
        return qb;
    }
    async getOrders(query) {
        const orders = await this.applyQueryFilter(this.applyOrderListSelect(this.createBaseQueryBuilder()), query)
            .orderBy('order.id', 'DESC')
            .getMany();
        for (const order of orders) {
            order['orderProducts'] = this.getOrderProductNames(order);
            delete order.orderLines;
            order['confirmDate'] = this.getOrderConfirmationDate(order);
            delete order.orderConfirmations;
        }
        return orders;
    }
    getOrderProductNames(order) {
        const products = new Set();
        for (const line of order.orderLines) {
            products.add(line.productMan.name);
        }
        return [...products].sort();
    }
    getOrderConfirmationDate(order) {
        if (!order.orderConfirmations?.length) {
            return undefined;
        }
        return order.orderConfirmations.reduce((latest, current) => current.id > latest.id ? current : latest).expectedDate;
    }
    async getOrderById(orderId) {
        const order = await this.createBaseQueryBuilder()
            .leftJoinAndMapOne('order.confirmation', 'order.orderConfirmations', 'confirmation', `confirmation.orderId = order.id AND NOT EXISTS
        (SELECT 1 FROM documents_orderconfirmation oc WHERE
        oc.order_id = order.id AND oc.id > confirmation.id)`)
            .where('order.id = :orderId', { orderId })
            .getOne();
        if (!order) {
            throw new common_1.NotFoundException(`Order with id: ${orderId} not found`);
        }
        const invoices = await this.invoiceService.getInvoicesByOrderId(orderId);
        const orderConfirmations = await this.orderConfirmationsService.getConfirmationsByOrderId(orderId);
        return { order, invoices, orderConfirmations };
    }
    async getOrdersByContractId(contractId) {
        const orders = await this.createBaseQueryBuilder()
            .where('order.contractId = :contractId', { contractId })
            .select(['order.id', 'order.status'])
            .orderBy('order.id', 'ASC')
            .getMany();
        await Promise.all(orders.map(async (order) => {
            order['invoices'] = await this.invoiceService.getInvoicesByOrderId(order.id);
        }));
        return orders;
    }
    async createOrder(createOrderDTO) {
        const newOrder = this.ordersRepository.create(createOrderDTO);
        newOrder.technicalProcesses =
            await this.getTechnicalProcesses(createOrderDTO);
        newOrder.isHidden = createOrderDTO.isHidden || false;
        newOrder.createdAt = new Date();
        newOrder.signatureDate = newOrder.signatureDate || newOrder.createdAt;
        newOrder.comment = newOrder.comment || '';
        newOrder.transportPlace = newOrder.transportPlace || '';
        newOrder.status = false;
        newOrder.paymentDelay = newOrder.paymentDelay || 0;
        newOrder.vat = newOrder.vat || 0;
        newOrder.orderNumber =
            newOrder.orderNumber ||
                (await this.createNextOrderNumber(newOrder.contractId, newOrder.sellerId));
        newOrder.documentSum = this.calculateDocumentSum(createOrderDTO);
        return await this.ordersRepository.save(newOrder);
    }
    calculateDocumentSum(createOrderDTO) {
        return (createOrderDTO.orderLines.reduce((acc, cur) => (acc += cur.price * cur.qty), 0) +
            createOrderDTO.orderServiceLines.reduce((acc, cur) => (acc += cur.price * cur.qty), 0));
    }
    async getTechnicalProcesses(createOrderDTO) {
        const productIds = (0, utils_1.getProductIdsFromOrderProductLines)(createOrderDTO.orderLines);
        const productProcesses = await this.goodsService.getTechnicalProcessesFromProductIds(productIds);
        const serviceIds = (0, utils_1.getServiceIdsFromServiceLines)(createOrderDTO.orderServiceLines);
        const serviceProcesses = await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);
        const technicalProcesses = [
            ...new Set([...productProcesses, ...serviceProcesses]),
        ];
        return technicalProcesses.map((process) => ({ id: process.id }));
    }
    async updateOrder(orderId, updateOrderDTO) {
        const order = await this.createBaseQueryBuilder()
            .where('order.id = :orderId', { orderId })
            .andWhere('order.status = FALSE')
            .leftJoinAndSelect('order.orderLines', 'orderLines')
            .leftJoinAndSelect('order.orderServiceLines', 'orderServiceLines')
            .leftJoinAndSelect('order.technicalProcesses', 'technicalProcesses')
            .getOne();
        if (!order) {
            throw new common_1.NotFoundException(`Order with id: ${orderId} and status: false not found`);
        }
        const updatedOrderLinesIds = updateOrderDTO.orderLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const orderLinesToDelete = order.orderLines.filter((line) => !updatedOrderLinesIds.includes(line.id));
        const updatedOrderServiceLinesIds = updateOrderDTO.orderServiceLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const orderServiceLinesToDelete = order.orderServiceLines.filter((line) => !updatedOrderServiceLinesIds.includes(line.id));
        const updated = Object.assign(order, updateOrderDTO);
        updated.technicalProcesses =
            await this.getTechnicalProcesses(updateOrderDTO);
        updated.documentSum = this.calculateDocumentSum(updated);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (orderLinesToDelete.length) {
                await queryRunner.manager.remove(orderLinesToDelete);
            }
            if (orderServiceLinesToDelete.length) {
                await queryRunner.manager.remove(orderServiceLinesToDelete);
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
    async removeOrder(orderId) {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId, status: false },
            relations: ['orderLines', 'orderServiceLines'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with id: ${orderId} and status: false not found`);
        }
        return await this.ordersRepository.remove(order);
    }
    async changeOrderStatus(orderId) {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with id: ${orderId} not found`);
        }
        order.status = !order.status;
        return await this.ordersRepository.save(order);
    }
    async createNextOrderNumber(contractId, sellerId) {
        const orderPrefix = (await this.contractsService.getOrderPrefix(contractId)) || '';
        const regexPattern = `^${orderPrefix}[0-9]+$`;
        const orders = await this.createBaseQueryBuilder()
            .where('order.sellerId = :sellerId', { sellerId })
            .andWhere('order.orderNumber ~ :regexPattern', {
            regexPattern,
        })
            .select(['order.orderNumber'])
            .getMany();
        let numbers = [];
        if (orderPrefix) {
            numbers = orders
                .map((order) => +order.orderNumber.split(orderPrefix)[1])
                .filter((item) => typeof item === 'number' && !isNaN(item) && item !== null);
        }
        else {
            numbers = orders.map((order) => +order.orderNumber);
        }
        return orderPrefix + (Math.max(...numbers, 0) + 1);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => contracts_1.ContractsService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => invoice_1.InvoiceService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        contracts_1.ContractsService,
        invoice_1.InvoiceService,
        goods_1.GoodsService,
        orders_confirmation_1.OrdersConfirmationService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map