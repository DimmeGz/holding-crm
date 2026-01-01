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
exports.LibsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const typeorm_2 = require("typeorm");
let LibsService = class LibsService {
    constructor(technicalProcessesRepository) {
        this.technicalProcessesRepository = technicalProcessesRepository;
    }
    createBaseQueryBuilder() {
        return this.technicalProcessesRepository
            .createQueryBuilder('technicalProcess')
            .select('technicalProcess.id');
    }
    async getTechnicalProcessesByInvoiceIds(invoiceIds) {
        return await this.createBaseQueryBuilder()
            .leftJoin('technicalProcess.invoices', 'invoice')
            .where('invoice.id IN (:...invoiceIds)', { invoiceIds })
            .getMany();
    }
    async getTechnicalProcessesByCommissionInvoiceId(commissionInvoiceId) {
        return await this.createBaseQueryBuilder()
            .leftJoin('technicalProcess.commissionInvoices', 'commissionInvoice')
            .where('commissionInvoice.id = :commissionInvoiceId', {
            commissionInvoiceId,
        })
            .getMany();
    }
    async getTechnicalProcessesByProductIds(productIds) {
        return await this.createBaseQueryBuilder()
            .leftJoin('technicalProcess.products', 'product')
            .where('product.id IN (:...productIds)', {
            productIds,
        })
            .getMany();
    }
    async getTechnicalProcessesByBatchId(batchId) {
        return await this.createBaseQueryBuilder()
            .leftJoin('technicalProcess.products', 'product')
            .leftJoin('product.batches', 'batch')
            .where('batch.id = :batchId', {
            batchId,
        })
            .getMany();
    }
};
exports.LibsService = LibsService;
exports.LibsService = LibsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TechnicalProcess)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LibsService);
//# sourceMappingURL=libs.service.js.map