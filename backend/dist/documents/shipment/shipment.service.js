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
exports.ShipmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const goods_1 = require("../../goods");
const receive_1 = require("../receive");
const transit_1 = require("../transit");
const warehouse_1 = require("../../warehouse");
const utils_1 = require("../../common/utils");
const entities_1 = require("./entities");
const enums_1 = require("../common/enums");
const constants_1 = require("../common/constants");
let ShipmentService = class ShipmentService {
    constructor(shipmentsRepository, shipmentLinessRepository, dataSource, goodsService, receiveService, transitService, warehouseService) {
        this.shipmentsRepository = shipmentsRepository;
        this.shipmentLinessRepository = shipmentLinessRepository;
        this.dataSource = dataSource;
        this.goodsService = goodsService;
        this.receiveService = receiveService;
        this.transitService = transitService;
        this.warehouseService = warehouseService;
    }
    createBaseQueryBuilder() {
        return this.shipmentsRepository.createQueryBuilder('shipment');
    }
    applyShipmentListSelect(qb) {
        return qb
            .leftJoin('shipment.seller', 'seller')
            .leftJoin('shipment.buyer', 'buyer')
            .leftJoin('shipment.invoice', 'invoice')
            .leftJoin('shipment.currency', 'currency')
            .leftJoin('shipment.sellerWarehouse', 'sellerWarehouse')
            .select([
            'shipment.id',
            'shipment.status',
            'shipment.documentSum',
            'shipment.expectedDate',
            'seller.name',
            'sellerWarehouse.name',
            'buyer.name',
            'invoice.invoiceNumber',
            'currency.name',
        ]);
    }
    applyShipmentDetailSelect(qb) {
        return qb
            .leftJoin('shipment.seller', 'seller')
            .leftJoin('shipment.buyer', 'buyer')
            .leftJoin('shipment.invoice', 'invoice')
            .leftJoin('shipment.currency', 'currency')
            .leftJoin('shipment.shipmentLines', 'shipmentLine')
            .leftJoin('shipmentLine.product', 'product')
            .leftJoin('shipmentLine.batch', 'batch')
            .leftJoin('shipmentLine.package', 'package')
            .leftJoin('shipment.shipmentServiceLines', 'shipmentServiceLine')
            .leftJoin('shipmentServiceLine.service', 'service')
            .select([
            'shipment.id',
            'shipment.status',
            'shipment.documentSum',
            'shipment.expectedDate',
            'shipment.incoterms',
            'shipment.transportPlace',
            'shipment.transportAmount',
            'shipment.comment',
            'seller.name',
            'buyer.name',
            'invoice.id',
            'invoice.invoiceNumber',
            'currency.name',
            'shipmentLine',
            'product.id',
            'product.name',
            'batch.id',
            'batch.name',
            'package.id',
            'package.name',
            'package.capacity',
            'shipmentServiceLine.id',
            'shipmentServiceLine.qty',
            'shipmentServiceLine.price',
            'service.id',
            'service.name',
        ]);
    }
    applyQueryFilter(qb, query) {
        if (!query || Object.keys(query).length === 0) {
            return qb;
        }
        if (query.company) {
            if (query.type) {
                if (query.type === enums_1.DocumentTypeEnum.BUYER) {
                    qb.andWhere('shipment.buyerId = :companyId', {
                        companyId: query.company,
                    });
                }
                else if (query.type === enums_1.DocumentTypeEnum.SELLER) {
                    qb.andWhere('shipment.sellerId = :companyId', {
                        companyId: query.company,
                    });
                }
            }
            else {
                qb.andWhere(new typeorm_2.Brackets((subQb) => {
                    subQb
                        .where('shipment.sellerId = :companyId', {
                        companyId: query.company,
                    })
                        .orWhere('shipment.buyerId = :companyId', {
                        companyId: query.company,
                    });
                }));
            }
        }
        if (query.date) {
            if (query.date === 'old') {
                qb.andWhere('EXTRACT(YEAR FROM shipment.expectedDate) < :maxYear', {
                    maxYear: constants_1.OLD_RECORDS_LIMIT,
                });
            }
            else {
                const [year, quarter] = query.date.split('-');
                const startDate = new Date(+year, constants_1.MONTHS_BY_QUATER[quarter].start - 1, 1);
                const endDate = new Date(+year, constants_1.MONTHS_BY_QUATER[quarter].end);
                qb.andWhere('shipment.expectedDate BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate,
                });
            }
        }
        return qb;
    }
    async getShipments(query) {
        return await this.applyQueryFilter(this.applyShipmentListSelect(this.createBaseQueryBuilder()), query)
            .orderBy('shipment.id', 'DESC')
            .getMany();
    }
    async getShipmentById(shipmentId) {
        const shipment = await this.applyShipmentDetailSelect(this.createBaseQueryBuilder())
            .where('shipment.id = :shipmentId', { shipmentId })
            .getOne();
        if (!shipment) {
            throw new common_1.NotFoundException(`Shipment with id: ${shipmentId} not found`);
        }
        const receives = await this.receiveService.getReceivesByShipmentId(shipmentId);
        return { shipment, receives };
    }
    async getShippedProductsByContract(contractId) {
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
    async getShipmentsByInvoiceId(invoiceId) {
        const shipments = await this.createBaseQueryBuilder()
            .where('shipment.invoiceId = :invoiceId', { invoiceId })
            .select(['shipment.id', 'shipment.status'])
            .orderBy('shipment.id', 'ASC')
            .getMany();
        await Promise.all(shipments.map(async (shipment) => {
            shipment['receives'] =
                await this.receiveService.getReceivesByShipmentId(shipment.id);
        }));
        return shipments;
    }
    async createShipment(createShipmentDTO) {
        const newShipment = new entities_1.Shipment(createShipmentDTO);
        newShipment.createdAt = new Date();
        newShipment.comment = newShipment.comment || '';
        newShipment.transportPlace = newShipment.transportPlace || '';
        newShipment.status = false;
        newShipment.technicalProcesses =
            await this.getTechnicalProcesses(createShipmentDTO);
        newShipment.documentSum = this.calculateDocumentSum(createShipmentDTO);
        return await this.shipmentsRepository.save(newShipment);
    }
    calculateDocumentSum(createShipmentDTO) {
        return (createShipmentDTO.shipmentLines.reduce((acc, cur) => (acc += cur.price * cur.qty), 0) +
            createShipmentDTO.shipmentServiceLines.reduce((acc, cur) => (acc += cur.price * cur.qty), 0));
    }
    async getTechnicalProcesses(createShipmentDTO) {
        const productIds = (0, utils_1.getProductIdsFromProductLines)(createShipmentDTO.shipmentLines);
        const productProcesses = await this.goodsService.getTechnicalProcessesFromProductIds(productIds);
        const serviceIds = (0, utils_1.getServiceIdsFromServiceLines)(createShipmentDTO.shipmentServiceLines);
        const serviceProcesses = await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);
        const technicalProcesses = [
            ...new Set([...productProcesses, ...serviceProcesses]),
        ];
        return technicalProcesses.map((process) => ({ id: process.id }));
    }
    async updateShipment(shipmentId, updateShipmentDTO) {
        const shipment = await this.createBaseQueryBuilder()
            .where('shipment.id = :shipmentId', { shipmentId })
            .andWhere('shipment.status = FALSE')
            .leftJoinAndSelect('shipment.shipmentLines', 'shipmentLines')
            .leftJoinAndSelect('shipment.shipmentServiceLines', 'shipmentServiceLines')
            .leftJoinAndSelect('shipment.technicalProcesses', 'technicalProcesses')
            .getOne();
        if (!shipment) {
            throw new common_1.NotFoundException(`Shipment with id: ${shipmentId} and status: false not found`);
        }
        const updatedShipmentLinesIds = updateShipmentDTO.shipmentLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const shipmentLinesToDelete = shipment.shipmentLines.filter((line) => !updatedShipmentLinesIds.includes(line.id));
        const updatedShipmentServiceLinesIds = updateShipmentDTO.shipmentServiceLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const shipmentServiceLinesToDelete = shipment.shipmentServiceLines.filter((line) => !updatedShipmentServiceLinesIds.includes(line.id));
        const updated = Object.assign(shipment, updateShipmentDTO);
        updated.technicalProcesses =
            await this.getTechnicalProcesses(updateShipmentDTO);
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
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException();
        }
        finally {
            await queryRunner.release();
        }
    }
    async removeShipment(shipmentId) {
        const shipment = await this.shipmentsRepository.findOne({
            where: { id: shipmentId, status: false },
            relations: ['shipmentLines', 'shipmentServiceLines'],
        });
        if (!shipment) {
            throw new common_1.NotFoundException(`Shipment with id: ${shipmentId} and status: false not found`);
        }
        return await this.shipmentsRepository.remove(shipment);
    }
    async changeShipmentStatus(shipmentId) {
        const shipment = await this.shipmentsRepository.findOne({
            where: { id: shipmentId },
            relations: ['shipmentLines'],
        });
        if (!shipment) {
            throw new common_1.NotFoundException(`Shipment with id: ${shipmentId} not found`);
        }
        shipment.status = !shipment.status;
        await this.updateWarehouseAccounting(shipment);
        await this.updateTransitLines(shipment);
        return await this.shipmentsRepository.save(shipment);
    }
    async updateWarehouseAccounting(shipment) {
        const warehousePromises = shipment.shipmentLines.map((line) => {
            if (!shipment.status) {
                return this.warehouseService.decreaseShipGoodsCount({
                    companyId: shipment.sellerId,
                    warehouseId: shipment.sellerWarehouseId,
                    batchId: line.batchId,
                    packageId: line.packageId,
                    qty: line.qty,
                });
            }
            else {
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
    async updateTransitLines(shipment) {
        if (shipment.status) {
            await this.transitService.createTransitLine({
                shipmentId: shipment.id,
                lines: shipment.shipmentLines,
            });
        }
        else {
            await this.transitService.removeTransitLines(shipment.id);
        }
    }
};
exports.ShipmentService = ShipmentService;
exports.ShipmentService = ShipmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Shipment)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.ShipmentLine)),
    __param(2, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        goods_1.GoodsService,
        receive_1.ReceiveService,
        transit_1.TransitService,
        warehouse_1.WarehouseService])
], ShipmentService);
//# sourceMappingURL=shipment.service.js.map