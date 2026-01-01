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
exports.ProductionReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../companies/entities");
const utils_1 = require("../common/utils");
let ProductionReportService = class ProductionReportService {
    constructor(companiesRepository) {
        this.companiesRepository = companiesRepository;
    }
    async productionReport(companyId, query) {
        const { firstMonthDay, lastMonthDay } = (0, utils_1.getFirstAndLastDaysOfMonth)(query?.date);
        const companyQB = this.companiesRepository
            .createQueryBuilder('company')
            .where('company.id = :companyId', { companyId })
            .leftJoin('company.productions', 'production', 'production.status = true AND production.expectedDate BETWEEN :firstMonthDay AND :lastMonthDay', { firstMonthDay, lastMonthDay })
            .select(['company.id', 'company.name', 'production.id']);
        if (query?.process) {
            companyQB
                .leftJoin('production.technicalProcesses', 'technicalProcess')
                .andWhere('technicalProcess.id = :processId', {
                processId: query.process,
            });
        }
        companyQB
            .leftJoin('production.productionInLines', 'inLine')
            .leftJoin('inLine.batch', 'inBatch')
            .leftJoin('inBatch.product', 'inProduct')
            .addSelect(['inLine.qty', 'inBatch.name', 'inProduct.name'])
            .leftJoin('production.productionOutLines', 'outLine')
            .leftJoin('outLine.batch', 'outBatch')
            .leftJoin('outBatch.product', 'outProduct')
            .addSelect(['outLine.qty', 'outBatch.name', 'outProduct.name']);
        const company = await companyQB.getOne();
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        const companyData = { id: company.id, name: company.name };
        const outProductions = company.productions.map((production) => {
            delete production.productionInLines;
            return production;
        });
        const inProductions = company.productions.map((production) => {
            delete production.productionInLines;
            return production;
        });
        return {
            company: companyData,
            outProductions,
            inProductions,
        };
    }
};
exports.ProductionReportService = ProductionReportService;
exports.ProductionReportService = ProductionReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductionReportService);
//# sourceMappingURL=production-report.service.js.map