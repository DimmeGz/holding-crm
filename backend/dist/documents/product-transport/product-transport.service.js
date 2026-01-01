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
exports.ProductTransportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const libs_1 = require("../../libs");
const warehouse_1 = require("../../warehouse");
const entities_1 = require("./entities");
let ProductTransportService = class ProductTransportService {
    constructor(productTransportRepository, dataSource, libsService, warehouseService) {
        this.productTransportRepository = productTransportRepository;
        this.dataSource = dataSource;
        this.libsService = libsService;
        this.warehouseService = warehouseService;
    }
    createBaseQueryBuilder() {
        return this.productTransportRepository.createQueryBuilder('productTransport');
    }
    applyProductTransportListSelect(qb) {
        return qb
            .leftJoin('productTransport.company', 'company')
            .leftJoin('productTransport.warehouseSender', 'warehouseSender')
            .leftJoin('productTransport.warehouseReceive', 'warehouseReceive')
            .select([
            'productTransport.id',
            'productTransport.status',
            'productTransport.expectedDate',
            'company.name',
            'warehouseSender.name',
            'warehouseReceive.name',
        ]);
    }
    applyProductTransportDetailSelect(qb) {
        return qb
            .leftJoin('productTransport.company', 'company')
            .leftJoin('productTransport.warehouseSender', 'warehouseSender')
            .leftJoin('productTransport.warehouseReceive', 'warehouseReceive')
            .leftJoin('productTransport.productTransportLines', 'productTransportLine')
            .leftJoin('productTransportLine.product', 'product')
            .leftJoin('productTransportLine.batch', 'batch')
            .leftJoin('productTransportLine.package', 'package')
            .select([
            'productTransport.id',
            'productTransport.status',
            'productTransport.expectedDate',
            'productTransport.comment',
            'company.name',
            'warehouseSender.name',
            'warehouseReceive.name',
            'productTransportLine',
            'product.name',
            'batch.name',
            'package.name',
        ]);
    }
    async getProductTransports() {
        return await this.applyProductTransportListSelect(this.createBaseQueryBuilder())
            .orderBy('productTransport.id', 'DESC')
            .getMany();
    }
    async getProductTransportById(productTransportId) {
        const productTransport = await this.applyProductTransportDetailSelect(this.createBaseQueryBuilder())
            .where('productTransport.id = :productTransportId', {
            productTransportId,
        })
            .getOne();
        if (!productTransport) {
            throw new common_1.NotFoundException(`Product transport with id: ${productTransportId} not found`);
        }
        return productTransport;
    }
    async createProductTransport(createTransportDTO) {
        const newTransport = this.productTransportRepository.create(createTransportDTO);
        newTransport.status = false;
        newTransport.createdAt = new Date();
        newTransport.expectedDate =
            newTransport.expectedDate || newTransport.createdAt;
        newTransport.comment = newTransport.comment || '';
        const productIds = newTransport.productTransportLines.map((line) => line.productId);
        newTransport.technicalProcesses =
            await this.libsService.getTechnicalProcessesByProductIds([...productIds]);
        return await this.productTransportRepository.save(newTransport);
    }
    async updateProductTransport(productTransportId, updateTransportDTO) {
        const transport = await this.createBaseQueryBuilder()
            .where('productTransport.id = :productTransportId', {
            productTransportId,
        })
            .andWhere('productTransport.status = FALSE')
            .leftJoinAndSelect('productTransport.productTransportLines', 'productTransportLines')
            .leftJoinAndSelect('productTransport.productTransportServiceLines', 'productTransportServiceLines')
            .leftJoinAndSelect('productTransport.technicalProcesses', 'technicalProcesses')
            .getOne();
        if (!transport) {
            throw new common_1.NotFoundException(`Product transport with id: ${productTransportId} and status: false not found`);
        }
        const updatedTransportLinesIds = updateTransportDTO.productTransportLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const transportLinesToDelete = transport.productTransportLines.filter((line) => !updatedTransportLinesIds.includes(line.id));
        const updatedTransportServiceLinesIds = updateTransportDTO.productTransportServiceLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const transportServiceLinesToDelete = transport.productTransportServiceLines.filter((line) => !updatedTransportServiceLinesIds.includes(line.id));
        const updated = Object.assign(transport, updateTransportDTO);
        const productIds = updated.productTransportLines.map((line) => line.productId);
        updated.technicalProcesses =
            await this.libsService.getTechnicalProcessesByProductIds([...productIds]);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (transportLinesToDelete.length) {
                await queryRunner.manager.remove(transportLinesToDelete);
            }
            if (transportServiceLinesToDelete.length) {
                await queryRunner.manager.remove(transportServiceLinesToDelete);
            }
            await queryRunner.manager.save(updated);
            await queryRunner.commitTransaction();
            return updated;
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(e);
        }
        finally {
            await queryRunner.release();
        }
    }
    async removeProductTransport(productTransportId) {
        const transport = await this.productTransportRepository.findOne({
            where: { id: productTransportId, status: false },
            relations: ['productTransportLines', 'productTransportServiceLines'],
        });
        if (!transport) {
            throw new common_1.NotFoundException(`Product transport with id: ${productTransportId} and status: false not found`);
        }
        return await this.productTransportRepository.remove(transport);
    }
    async changeProductTransportStatus(productTransportId) {
        const transport = await this.productTransportRepository.findOne({
            where: { id: productTransportId },
            relations: ['productTransportLines', 'productTransportServiceLines'],
        });
        if (!transport) {
            throw new common_1.NotFoundException(`Product transport with id: ${productTransportId} not found`);
        }
        transport.status = !transport.status;
        await this.updateWarehouseAccounting(transport);
        return await this.productTransportRepository.save(transport);
    }
    async updateWarehouseAccounting(transport) {
        const totalQty = transport.productTransportLines.reduce((acc, cur) => (acc += cur.qty), 0);
        const totalTransportAmount = transport.productTransportServiceLines.reduce((acc, cur) => (acc += cur.price * cur.qty), 0);
        if (transport.status) {
            await this.warehouseService.transportProducts({
                companyId: transport.companyId,
                warehouseSenderId: transport.warehouseSenderId,
                warehouseReceiveId: transport.warehouseReceiveId,
                transportLines: transport.productTransportLines,
                transportCost: totalTransportAmount
                    ? totalTransportAmount / totalQty
                    : 0,
            });
        }
        else {
            await this.warehouseService.unTransportProducts({
                companyId: transport.companyId,
                warehouseSenderId: transport.warehouseSenderId,
                warehouseReceiveId: transport.warehouseReceiveId,
                transportLines: transport.productTransportLines,
                transportCost: totalTransportAmount
                    ? totalTransportAmount / totalQty
                    : 0,
            });
        }
    }
};
exports.ProductTransportService = ProductTransportService;
exports.ProductTransportService = ProductTransportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ProductTransport)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        libs_1.LibsService,
        warehouse_1.WarehouseService])
], ProductTransportService);
//# sourceMappingURL=product-transport.service.js.map