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
exports.ProductionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const libs_1 = require("../../libs");
const warehouse_1 = require("../../warehouse");
const entities_1 = require("./entities");
let ProductionService = class ProductionService {
    constructor(productionsRepository, dataSource, libsService, warehouseService) {
        this.productionsRepository = productionsRepository;
        this.dataSource = dataSource;
        this.libsService = libsService;
        this.warehouseService = warehouseService;
    }
    createBaseQueryBuilder() {
        return this.productionsRepository.createQueryBuilder('production');
    }
    applyProductionListSelect(qb) {
        return qb
            .leftJoin('production.company', 'company')
            .leftJoin('production.warehouse', 'warehouse')
            .leftJoin('production.productionInLines', 'productionInLine')
            .leftJoin('productionInLine.product', 'product')
            .select([
            'production.id',
            'production.status',
            'production.expectedDate',
            'company.name',
            'warehouse.name',
            'productionInLine.id',
            'product.name',
        ]);
    }
    applyProductionDetailSelect(qb) {
        return qb
            .leftJoin('production.company', 'company')
            .leftJoin('production.warehouse', 'warehouse')
            .leftJoin('production.productionOutLines', 'productionOutLine')
            .leftJoin('productionOutLine.product', 'outProduct')
            .leftJoin('productionOutLine.batch', 'outBatch')
            .leftJoin('productionOutLine.package', 'outPackage')
            .leftJoin('production.productionInLines', 'productionInLine')
            .leftJoin('productionInLine.product', 'inProduct')
            .leftJoin('productionInLine.batch', 'inBatch')
            .leftJoin('productionInLine.package', 'inPackage')
            .select([
            'production.id',
            'production.status',
            'production.expectedDate',
            'production.comment',
            'company.name',
            'warehouse.name',
            'productionOutLine',
            'outProduct.id',
            'outProduct.name',
            'outBatch.id',
            'outBatch.name',
            'outPackage.name',
            'productionInLine',
            'inProduct.id',
            'inProduct.name',
            'inBatch.id',
            'inBatch.name',
            'inPackage.name',
        ]);
    }
    async getProductions() {
        return await this.applyProductionListSelect(this.createBaseQueryBuilder())
            .orderBy('production.id', 'DESC')
            .getMany();
    }
    async getProductionById(productionId) {
        const production = await this.applyProductionDetailSelect(this.createBaseQueryBuilder())
            .where('production.id = :productionId', { productionId })
            .getOne();
        if (!production) {
            throw new common_1.NotFoundException(`Production with id: ${productionId} not found`);
        }
        return production;
    }
    async createProduction(createProductionDTO) {
        const newProduction = this.productionsRepository.create(createProductionDTO);
        newProduction.status = false;
        newProduction.createdAt = new Date();
        newProduction.expectedDate =
            newProduction.expectedDate || newProduction.createdAt;
        newProduction.comment = newProduction.comment || '';
        const productIds = new Set([
            ...newProduction.productionInLines.map((line) => line.productId),
            ...newProduction.productionOutLines.map((line) => line.productId),
        ]);
        newProduction.technicalProcesses =
            await this.libsService.getTechnicalProcessesByProductIds([...productIds]);
        return await this.productionsRepository.save(newProduction);
    }
    async updateProduction(productionId, updateProductionDTO) {
        const production = await this.createBaseQueryBuilder()
            .where('production.id = :productionId', { productionId })
            .leftJoinAndSelect('production.productionInLines', 'productionInLine')
            .leftJoinAndSelect('production.productionOutLines', 'productionOutLine')
            .getOne();
        if (!production) {
            throw new common_1.NotFoundException(`Production with id: ${productionId} not found`);
        }
        const updatedInLinesIds = updateProductionDTO.productionInLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const inLinesToDelete = production.productionInLines.filter((line) => !updatedInLinesIds.includes(line.id));
        const updatedOutLinesIds = updateProductionDTO.productionOutLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const outLinesToDelete = production.productionOutLines.filter((line) => !updatedOutLinesIds.includes(line.id));
        const updated = Object.assign(production, updateProductionDTO);
        const productIds = new Set([
            ...updated.productionInLines.map((line) => line.productId),
            ...updated.productionOutLines.map((line) => line.productId),
        ]);
        updated.technicalProcesses =
            await this.libsService.getTechnicalProcessesByProductIds([...productIds]);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (inLinesToDelete.length) {
                await queryRunner.manager.remove(inLinesToDelete);
            }
            if (outLinesToDelete.length) {
                await queryRunner.manager.remove(outLinesToDelete);
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
    async removeProduction(productionId) {
        const production = await this.productionsRepository.findOne({
            where: { id: productionId, status: false },
            relations: ['productionInLines', 'productionOutLines'],
        });
        if (!production) {
            throw new common_1.NotFoundException(`Production with id: ${productionId} and status: false not found`);
        }
        return await this.productionsRepository.remove(production);
    }
    async changeProductionStatus(productionId) {
        const production = await this.productionsRepository.findOne({
            where: {
                id: productionId,
            },
            relations: ['productionOutLines', 'productionInLines'],
        });
        if (!production) {
            throw new common_1.NotFoundException(`Production with id: ${productionId} not found`);
        }
        production.status = !production.status;
        await this.warehouseService.makeProduction({
            companyId: production.companyId,
            warehouseId: production.warehouseId,
            status: production.status,
            outLines: production.productionOutLines,
            inLines: production.productionInLines,
        });
        return await this.productionsRepository.save(production);
    }
};
exports.ProductionService = ProductionService;
exports.ProductionService = ProductionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Production)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        libs_1.LibsService,
        warehouse_1.WarehouseService])
], ProductionService);
//# sourceMappingURL=production.service.js.map