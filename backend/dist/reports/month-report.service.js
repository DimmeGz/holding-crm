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
exports.MonthReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../documents/invoice/entities");
const entities_2 = require("../companies/entities");
const utils_1 = require("../common/utils");
var ReportTypeEnum;
(function (ReportTypeEnum) {
    ReportTypeEnum[ReportTypeEnum["REPORT_TYPE_1"] = 1] = "REPORT_TYPE_1";
})(ReportTypeEnum || (ReportTypeEnum = {}));
let MonthReportService = class MonthReportService {
    constructor(companiesRepository, invoicesRepository) {
        this.companiesRepository = companiesRepository;
        this.invoicesRepository = invoicesRepository;
        this.REPORT_TYPE_DICT = {
            [ReportTypeEnum.REPORT_TYPE_1]: this.getReportType1.bind(this),
        };
    }
    async monthReport(companyId, query) {
        const datePeriod = (0, utils_1.getFirstAndLastDaysOfMonth)(query?.date);
        const company = await this.companiesRepository.findOne({
            where: { id: companyId },
            select: {
                id: true,
                name: true,
                reportType: true,
            },
        });
        if (!company) {
            throw new common_1.NotFoundException(`Company with id: ${companyId} not found`);
        }
        const reportFunction = this.REPORT_TYPE_DICT[company.reportType];
        if (!reportFunction) {
            throw new common_1.BadRequestException(`Invalid reportType: ${company.reportType}`);
        }
        const { incomeInvoices, outcomeInvoices } = await reportFunction(companyId, datePeriod, query);
        return { company, incomeInvoices, outcomeInvoices };
    }
    async getReportType1(companyId, datePeriod, query) {
        const incomeInvoices = await this.getInvoices(companyId, datePeriod, 'income', query);
        const outcomeInvoices = await this.getInvoices(companyId, datePeriod, 'outcome', query);
        return {
            incomeInvoices,
            outcomeInvoices,
        };
    }
    async getInvoices(companyId, datePeriod, type, query) {
        const invoicesQuery = this.invoicesRepository.createQueryBuilder('invoice');
        if (type === 'income') {
            invoicesQuery
                .where('invoice.buyerId = :companyId', { companyId })
                .leftJoin('invoice.buyer', 'partner');
        }
        else if (type === 'outcome') {
            invoicesQuery
                .where('invoice.sellerId = :companyId', { companyId })
                .leftJoin('invoice.seller', 'partner');
        }
        invoicesQuery
            .andWhere('invoice.expectedDate BETWEEN :firstMonthDay AND :lastMonthDay', {
            firstMonthDay: datePeriod.firstMonthDay,
            lastMonthDay: datePeriod.lastMonthDay,
        })
            .andWhere('invoice.status = true')
            .leftJoin('invoice.invoiceLines', 'invoiceLine')
            .leftJoin('invoiceLine.product', 'product')
            .leftJoin('invoiceLine.batch', 'batch')
            .leftJoin('invoiceLine.order', 'order')
            .leftJoin('invoice.paymentLines', 'paymentLine')
            .leftJoin('paymentLine.payment', 'payment');
        if (query?.process) {
            invoicesQuery
                .leftJoin('invoice.technicalProcesses', 'technicalProcess')
                .andWhere('technicalProcess.id = :processId', {
                processId: query.process,
            });
        }
        invoicesQuery.select([
            'invoice.id',
            'invoice.invoiceNumber',
            'invoice.expectedDate',
            'invoice.vat',
            'invoice.documentSum',
            'invoice.paymentDelay',
            'invoice.transportAmount',
            'partner.id',
            'partner.name',
            'invoiceLine.id',
            'invoiceLine.qty',
            'invoiceLine.price',
            'product.id',
            'product.name',
            'batch.id',
            'batch.name',
            'order.id',
            'order.orderNumber',
            'paymentLine.id',
            'payment.id',
            'payment.documentSum',
            'payment.expectedDate',
        ]);
        const invoices = await invoicesQuery.getMany();
        invoices.forEach((invoice) => {
            invoice['orders'] = [
                ...new Set(invoice.invoiceLines.map((invoiceLine) => invoiceLine.order)),
            ];
            invoice['payments'] = [
                ...new Set(invoice.paymentLines.map((paymentLine) => paymentLine.payment)),
            ];
        });
        return invoices;
    }
};
exports.MonthReportService = MonthReportService;
exports.MonthReportService = MonthReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_2.Company)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MonthReportService);
//# sourceMappingURL=month-report.service.js.map