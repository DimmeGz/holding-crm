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
exports.ReceiveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const utils_1 = require("../../common/utils");
const goods_1 = require("../../goods");
const transit_1 = require("../transit");
const warehouse_1 = require("../../warehouse");
const entities_1 = require("./entities");
const enums_1 = require("../common/enums");
const constants_1 = require("../common/constants");
let ReceiveService = class ReceiveService {
    constructor(receivesRepository, dataSource, goodsService, transitService, warehouseService) {
        this.receivesRepository = receivesRepository;
        this.dataSource = dataSource;
        this.goodsService = goodsService;
        this.transitService = transitService;
        this.warehouseService = warehouseService;
    }
    createBaseQueryBuilder() {
        return this.receivesRepository.createQueryBuilder('receive');
    }
    applyReceiveListSelect(qb) {
        return qb
            .leftJoin('receive.seller', 'seller')
            .leftJoin('receive.buyer', 'buyer')
            .leftJoin('receive.shipment', 'shipment')
            .leftJoin('receive.currency', 'currency')
            .select([
            'receive.id',
            'receive.expectedDate',
            'receive.documentSum',
            'receive.status',
            'seller.name',
            'buyer.name',
            'shipment.id',
            'currency.name',
        ]);
    }
    applyReceiveDetailSelect(qb) {
        return qb
            .leftJoin('receive.seller', 'seller')
            .leftJoin('receive.buyer', 'buyer')
            .leftJoin('receive.buyerWarehouse', 'buyerWarehouse')
            .leftJoin('receive.shipment', 'shipment')
            .leftJoin('shipment.invoice', 'invoice')
            .leftJoin('receive.currency', 'currency')
            .leftJoin('receive.receiveLines', 'receiveLine')
            .leftJoin('receiveLine.product', 'product')
            .leftJoin('receiveLine.batch', 'batch')
            .leftJoin('receiveLine.package', 'package')
            .select([
            'receive.id',
            'receive.expectedDate',
            'receive.documentSum',
            'receive.status',
            'receive.incoterms',
            'receive.transportPlace',
            'receive.transportAmount',
            'receive.comment',
            'seller.name',
            'buyer.name',
            'buyerWarehouse.name',
            'shipment.id',
            'invoice.id',
            'invoice.invoiceNumber',
            'currency.name',
            'receiveLine',
            'product.name',
            'batch.id',
            'batch.name',
            'package.name',
            'package.capacity',
        ]);
    }
    applyQueryFiler(qb, query) {
        if (query.company) {
            if (query.type) {
                if (query.type === enums_1.DocumentTypeEnum.BUYER) {
                    qb.andWhere('receive.buyerId = :companyId', {
                        companyId: query.company,
                    });
                }
                else if (query.type === enums_1.DocumentTypeEnum.SELLER) {
                    qb.andWhere('receive.sellerId = :companyId', {
                        companyId: query.company,
                    });
                }
            }
            else {
                qb.andWhere(new typeorm_2.Brackets((subQb) => {
                    subQb
                        .where('receive.sellerId = :companyId', {
                        companyId: query.company,
                    })
                        .orWhere('receive.buyerId = :companyId', {
                        companyId: query.company,
                    });
                }));
            }
        }
        if (query.date) {
            if (query.date === 'old') {
                qb.andWhere('EXTRACT(YEAR FROM receive.expectedDate) < :maxYear', {
                    maxYear: constants_1.OLD_RECORDS_LIMIT,
                });
            }
            else {
                const [year, quarter] = query.date.split('-');
                const startDate = new Date(+year, constants_1.MONTHS_BY_QUATER[quarter].start - 1, 1);
                const endDate = new Date(+year, constants_1.MONTHS_BY_QUATER[quarter].end);
                qb.andWhere('receive.expectedDate BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate,
                });
            }
        }
        return qb;
    }
    async getReceives(query) {
        return await this.applyQueryFiler(this.applyReceiveListSelect(this.createBaseQueryBuilder()), query)
            .orderBy('receive.id', 'DESC')
            .getMany();
    }
    async getReceiveById(receiveId) {
        const receive = await this.applyReceiveDetailSelect(this.createBaseQueryBuilder())
            .where('receive.id = :receiveId', { receiveId })
            .getOne();
        if (!receive) {
            throw new common_1.NotFoundException(`Receive with id: ${receiveId} not found`);
        }
        return receive;
    }
    async getReceivesByShipmentId(shipmentId) {
        return await this.createBaseQueryBuilder()
            .where('receive.shipmentId = :shipmentId', { shipmentId })
            .select(['receive.id', 'receive.status'])
            .orderBy('receive.id', 'ASC')
            .getMany();
    }
    async createReceive(createReceiveDTO) {
        const newReceive = new entities_1.Receive(createReceiveDTO);
        newReceive.status = false;
        newReceive.createdAt = new Date();
        newReceive.comment = newReceive.comment || '';
        newReceive.transportPlace = newReceive.transportPlace || '';
        newReceive.transportAmount = newReceive.transportAmount || 0;
        newReceive.documentSum = this.calculateDocumentSum(createReceiveDTO);
        newReceive.technicalProcesses =
            await this.getTechnicalProcesses(createReceiveDTO);
        const createdReceive = await this.receivesRepository.save(newReceive);
        await this.transitService.addReceiveToTransitLines({
            shipmentId: createReceiveDTO.shipmentId,
            receiveId: createdReceive.id,
            lines: createReceiveDTO.receiveLines,
        });
        return createdReceive;
    }
    calculateDocumentSum(createReceiveDTO) {
        return (createReceiveDTO.receiveLines.reduce((acc, cur) => (acc += cur.price * cur.qty), 0) +
            createReceiveDTO.receiveServiceLines.reduce((acc, cur) => (acc += cur.price * cur.qty), 0));
    }
    async getTechnicalProcesses(createReveiveDTO) {
        const productIds = (0, utils_1.getProductIdsFromProductLines)(createReveiveDTO.receiveLines);
        const productProcesses = await this.goodsService.getTechnicalProcessesFromProductIds(productIds);
        const serviceIds = (0, utils_1.getServiceIdsFromServiceLines)(createReveiveDTO.receiveServiceLines);
        const serviceProcesses = await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);
        const technicalProcesses = [
            ...new Set([...productProcesses, ...serviceProcesses]),
        ];
        return technicalProcesses.map((process) => ({ id: process.id }));
    }
    async updateReceive(receiveId, updateReceiveDTO) {
        const receive = await this.createBaseQueryBuilder()
            .where('receive.id = :receiveId', { receiveId })
            .andWhere('receive.status = FALSE')
            .leftJoinAndSelect('receive.receiveLines', 'receiveLines')
            .leftJoinAndSelect('receive.receiveServiceLines', 'receiveServiceLines')
            .leftJoinAndSelect('receive.technicalProcesses', 'technicalProcesses')
            .getOne();
        if (!receive) {
            throw new common_1.NotFoundException(`Receive with id: ${receiveId} and status: false not found`);
        }
        const updatedReceiveLinesIds = updateReceiveDTO.receiveLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const receiveLinesToDelete = receive.receiveLines.filter((line) => !updatedReceiveLinesIds.includes(line.id));
        const updatedReceiveServiceLinesIds = updateReceiveDTO.receiveServiceLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const receiveServiceLinesToDelete = receive.receiveServiceLines.filter((line) => !updatedReceiveServiceLinesIds.includes(line.id));
        const updated = Object.assign(receive, updateReceiveDTO);
        updated.documentSum = this.calculateDocumentSum(updated);
        updated.technicalProcesses = await this.getTechnicalProcesses(updated);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (receiveLinesToDelete.length) {
                await queryRunner.manager.remove(receiveLinesToDelete);
            }
            if (receiveServiceLinesToDelete.length) {
                await queryRunner.manager.remove(receiveServiceLinesToDelete);
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
    async removeReceive(receiveId) {
        const receive = await this.receivesRepository.findOne({
            where: { id: receiveId, status: false },
            relations: ['receiveLines', 'receiveServiceLines'],
        });
        if (!receive) {
            throw new common_1.NotFoundException(`Receive with id: ${receiveId} and status: false not found`);
        }
        return await this.receivesRepository.remove(receive);
    }
    async changeReceiveStatus(receiveId) {
        const receive = await this.receivesRepository.findOne({
            where: { id: receiveId },
            relations: ['receiveLines'],
        });
        if (!receive) {
            throw new common_1.NotFoundException(`Receive with id: ${receiveId} not found`);
        }
        receive.status = !receive.status;
        await this.updateWarehouseAccounting(receive);
        await this.updateTransitLines(receive);
        return await this.receivesRepository.save(receive);
    }
    async updateWarehouseAccounting(receive) {
        const warehousePromises = receive.receiveLines.map((line) => {
            if (receive.status) {
                return this.warehouseService.increaseReceiveGoodsCount({
                    companyId: receive.buyerId,
                    warehouseId: receive.buyerWarehouseId,
                    batchId: line.batchId,
                    packageId: line.packageId,
                    qty: line.qty,
                    price: line.price,
                    currencyId: receive.currencyId,
                });
            }
            else {
                return this.warehouseService.returnReceiveGoodsCount({
                    companyId: receive.buyerId,
                    warehouseId: receive.buyerWarehouseId,
                    batchId: line.batchId,
                    packageId: line.packageId,
                    qty: line.qty,
                    price: line.price,
                    currencyId: receive.currencyId,
                });
            }
        });
        await Promise.all(warehousePromises);
    }
    async updateTransitLines(receive) {
        if (receive.status) {
            await this.transitService.receiveTransitLines({
                receiveId: receive.id,
                lines: receive.receiveLines,
            });
        }
        else {
            await this.transitService.cancelReceiveTransitLines({
                receiveId: receive.id,
                lines: receive.receiveLines,
            });
        }
    }
};
exports.ReceiveService = ReceiveService;
exports.ReceiveService = ReceiveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Receive)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        goods_1.GoodsService,
        transit_1.TransitService,
        warehouse_1.WarehouseService])
], ReceiveService);
//# sourceMappingURL=receive.service.js.map