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
exports.GoodsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const entities_2 = require("../documents/production/entities");
const entities_3 = require("../documents/invoice/entities");
let GoodsService = class GoodsService {
    constructor(batchesRepository, productsRepository, servicesRepository) {
        this.batchesRepository = batchesRepository;
        this.productsRepository = productsRepository;
        this.servicesRepository = servicesRepository;
    }
    async getBatchData(batchId) {
        const batch = await this.batchesRepository.findOne({
            where: { id: batchId },
            relations: ['product'],
            select: {
                id: true,
                name: true,
                product: {
                    id: true,
                    name: true,
                },
            },
        });
        if (!batch) {
            throw new common_1.NotFoundException(`Batch with id: ${batchId} not found`);
        }
        const invoiceLines = await this.getInvoiceLinesByBatchIds(batchId);
        const productionOutLines = await this.getProductionOutLinesByBatchIds(batchId);
        const productionInLines = await this.getProductionInLinesByBatchIds(batchId);
        return { batch, invoiceLines, productionOutLines, productionInLines };
    }
    async getInvoiceLinesByBatchIds(batchIds) {
        const invoiceLines = await this.batchesRepository.manager.find(entities_3.InvoiceLine, {
            where: {
                batch: { id: Array.isArray(batchIds) ? (0, typeorm_2.In)(batchIds) : batchIds },
            },
            relations: ['invoice', 'invoice.seller', 'invoice.buyer'],
            select: {
                id: true,
                qty: true,
                price: true,
                invoice: {
                    id: true,
                    status: true,
                    invoiceNumber: true,
                    expectedDate: true,
                    seller: {
                        id: true,
                        name: true,
                    },
                    buyer: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return invoiceLines;
    }
    async getProductionOutLinesByBatchIds(batchIds) {
        const productionOutLines = await this.batchesRepository.manager.find(entities_2.ProductionOutLine, {
            where: {
                batch: { id: Array.isArray(batchIds) ? (0, typeorm_2.In)(batchIds) : batchIds },
            },
            relations: ['production', 'production.company'],
            select: {
                id: true,
                qty: true,
                production: {
                    id: true,
                    status: true,
                    expectedDate: true,
                    company: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return productionOutLines;
    }
    async getProductionInLinesByBatchIds(batchIds) {
        const productionInLines = await this.batchesRepository.manager.find(entities_2.ProductionInLine, {
            where: {
                batch: { id: Array.isArray(batchIds) ? (0, typeorm_2.In)(batchIds) : batchIds },
            },
            relations: ['production', 'production.company'],
            select: {
                id: true,
                qty: true,
                production: {
                    id: true,
                    status: true,
                    expectedDate: true,
                    company: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return productionInLines;
    }
    async getProductData(productId) {
        const product = await this.productsRepository.findOne({
            where: { id: productId },
            relations: ['batches'],
            select: {
                id: true,
                name: true,
                batches: {
                    id: true,
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with id: ${productId} not found`);
        }
        const batchIds = product.batches.map((batch) => batch.id);
        const invoiceLines = await this.getInvoiceLinesByBatchIds(batchIds);
        const productionOutLines = await this.getProductionOutLinesByBatchIds(batchIds);
        const productionInLines = await this.getProductionInLinesByBatchIds(batchIds);
        return { product, invoiceLines, productionOutLines, productionInLines };
    }
    async getTechnicalProcessesFromProductIds(productIds) {
        if (productIds.length === 0) {
            return new Set();
        }
        const products = await this.productsRepository
            .createQueryBuilder('product')
            .leftJoin('product.technicalProcesses', 'technicalProcess')
            .where('product.id IN (:...productIds)', { productIds })
            .select(['product.id', 'technicalProcess.id'])
            .getMany();
        const processes = new Set();
        for (const product of products) {
            if (product.technicalProcesses) {
                product.technicalProcesses.forEach((process) => processes.add(process));
            }
        }
        return processes;
    }
    async getTechnicalProcessesFromServiceIds(serviceIds) {
        if (serviceIds.length === 0) {
            return new Set();
        }
        const services = await this.servicesRepository
            .createQueryBuilder('service')
            .leftJoin('service.technicalProcesses', 'technicalProcess')
            .where('service.id IN (:...serviceIds)', { serviceIds })
            .select(['service.id', 'technicalProcess.id'])
            .getMany();
        const processes = new Set();
        for (const service of services) {
            if (service.technicalProcesses) {
                service.technicalProcesses.forEach((process) => processes.add(process));
            }
        }
        return processes;
    }
};
exports.GoodsService = GoodsService;
exports.GoodsService = GoodsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Batch)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GoodsService);
//# sourceMappingURL=goods.service.js.map