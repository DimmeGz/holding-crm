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
exports.CommissionInvoiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const companies_1 = require("../../companies");
const invoice_1 = require("../invoice");
const entities_1 = require("./entities");
let CommissionInvoiceService = class CommissionInvoiceService {
    constructor(commissionRepository, invoicesService, companiesService) {
        this.commissionRepository = commissionRepository;
        this.invoicesService = invoicesService;
        this.companiesService = companiesService;
    }
    createBaseQueryBuilder() {
        return this.commissionRepository
            .createQueryBuilder('commission')
            .leftJoin('commission.seller', 'seller')
            .leftJoin('commission.buyer', 'buyer')
            .leftJoin('commission.currency', 'currency')
            .leftJoin('commission.invoice', 'invoice')
            .leftJoin('invoice.children', 'invoiceChildren');
    }
    applyBaseSelect(qb) {
        return qb.select([
            'commission.id',
            'commission.status',
            'commission.rate',
            'commission.documentSum',
            'currency.name',
            'seller.name',
            'buyer.name',
            'invoice.id',
            'invoice.invoiceNumber',
            'invoiceChildren.id',
            'invoiceChildren.invoiceNumber',
        ]);
    }
    async getCommissionInvoicess() {
        return await this.applyBaseSelect(this.createBaseQueryBuilder())
            .orderBy('commission.id', 'DESC')
            .getMany();
    }
    async getCommissionInvoiceById(commissionId) {
        const commission = await this.applyBaseSelect(this.createBaseQueryBuilder())
            .addSelect([
            'commission.creationDate',
            'commission.paymentBalance',
            'invoice.documentSum',
            'invoiceChildren.documentSum',
        ])
            .where('commission.id = :commissionId', { commissionId })
            .getOne();
        if (!commission) {
            throw new common_1.NotFoundException(`Commission Invoice with ID ${commissionId} not found`);
        }
        return commission;
    }
    async createCommissionInvoice(createCommissionInvoiceDTO) {
        const newCommissionInvoice = this.commissionRepository.create(createCommissionInvoiceDTO);
        newCommissionInvoice.status = false;
        newCommissionInvoice.createdAt = new Date();
        newCommissionInvoice.creationDate =
            newCommissionInvoice.creationDate || newCommissionInvoice.createdAt;
        newCommissionInvoice.comment = newCommissionInvoice.comment || '';
        await this.calculateAndSetDocumentSumAndBalance(newCommissionInvoice);
        return await this.commissionRepository.save(newCommissionInvoice);
    }
    async updateCommissionInvoice(commissionId, updateCommissionInvoiceDTO) {
        const commission = await this.commissionRepository.findOneBy({
            id: commissionId,
            status: false,
        });
        if (!commission) {
            throw new common_1.NotFoundException(`Commission invoice with id: ${commissionId} and status: false not found`);
        }
        Object.assign(commission, updateCommissionInvoiceDTO);
        await this.calculateAndSetDocumentSumAndBalance(commission);
        return await this.commissionRepository.save(commission);
    }
    async calculateAndSetDocumentSumAndBalance(commission) {
        const invoiceData = await this.invoicesService.getInvoiceDataForCommission(commission.invoiceId);
        const childrenSum = invoiceData.children.reduce((acc, cur) => (acc += cur.documentSum), 0);
        commission.documentSum = (childrenSum * commission.rate) / 100;
        commission.paymentBalance = commission.documentSum;
        commission.technicalProcesses = invoiceData.technicalProcesses;
    }
    async removeCommission(commissionId) {
        const commission = await this.commissionRepository.findOneBy({
            id: commissionId,
            status: false,
        });
        if (!commission) {
            throw new common_1.NotFoundException(`Commission invoice with id: ${commissionId} and status: false not found`);
        }
        return this.commissionRepository.remove(commission);
    }
    async changeCommissionStatus(commissionId) {
        const commission = await this.commissionRepository.findOneBy({
            id: commissionId,
        });
        if (!commission) {
            throw new common_1.NotFoundException(`Commission invoice with id: ${commissionId} not found`);
        }
        commission.status = !commission.status;
        await this.companiesService.changeInvoiceStatusBalances({
            sellerId: commission.sellerId,
            buyerId: commission.buyerId,
            currencyId: commission.currencyId,
            status: commission.status,
            amount: commission.documentSum,
        });
        return await this.commissionRepository.save(commission);
    }
};
exports.CommissionInvoiceService = CommissionInvoiceService;
exports.CommissionInvoiceService = CommissionInvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.CommissionInvoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        invoice_1.InvoiceService,
        companies_1.CompaniesService])
], CommissionInvoiceService);
//# sourceMappingURL=commission-invoice.service.js.map