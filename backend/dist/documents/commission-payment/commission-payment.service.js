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
exports.CommissionPaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const companies_1 = require("../../companies");
const libs_1 = require("../../libs");
const entities_1 = require("./entities");
let CommissionPaymentService = class CommissionPaymentService {
    constructor(commissionPaymentsRepository, companiesService, libsService) {
        this.commissionPaymentsRepository = commissionPaymentsRepository;
        this.companiesService = companiesService;
        this.libsService = libsService;
    }
    createBaseQueryBuilder() {
        return this.commissionPaymentsRepository
            .createQueryBuilder('commissionPayment')
            .leftJoin('commissionPayment.seller', 'seller')
            .leftJoin('commissionPayment.buyer', 'buyer')
            .leftJoin('commissionPayment.commissionInvoice', 'commissionInvoice')
            .leftJoin('commissionPayment.currency', 'currency');
    }
    applyBaseSelect(qb) {
        return qb.select([
            'commissionPayment.id',
            'commissionPayment.status',
            'commissionPayment.amount',
            'commissionPayment.expectedDate',
            'seller.name',
            'buyer.name',
            'commissionInvoice.id',
            'currency.name',
        ]);
    }
    async getCommisionPayments() {
        return await this.applyBaseSelect(this.createBaseQueryBuilder())
            .orderBy('commissionPayment.id', 'DESC')
            .getMany();
    }
    async getCommisionPaymentById(commissionPaymentId) {
        const commissionPayment = await this.applyBaseSelect(this.createBaseQueryBuilder())
            .where('commissionPayment.id = :commissionPaymentId', {
            commissionPaymentId,
        })
            .getOne();
        if (!commissionPayment) {
            throw new common_1.NotFoundException(`Commission Payment with ID ${commissionPaymentId} not found`);
        }
        return commissionPayment;
    }
    async createCommissionPayment(createCommissionPaymentDTO) {
        const { expectedDate, ...restDto } = createCommissionPaymentDTO;
        const newCommissionPayment = this.commissionPaymentsRepository.create(restDto);
        newCommissionPayment.expectedDate = expectedDate || new Date();
        newCommissionPayment.createdAt = new Date();
        newCommissionPayment.comment = newCommissionPayment.comment || '';
        newCommissionPayment.status = false;
        newCommissionPayment.technicalProcesses =
            await this.libsService.getTechnicalProcessesByCommissionInvoiceId(newCommissionPayment.commissionInvoiceId);
        return await this.commissionPaymentsRepository.save(newCommissionPayment);
    }
    async updateCommissionPayment(commissionPaymentId, updateCommissionPaymentDTO) {
        const commissionPayment = await this.commissionPaymentsRepository.findOneBy({
            id: commissionPaymentId,
            status: false,
        });
        if (!commissionPayment) {
            throw new common_1.NotFoundException(`Commission Payment with id: ${commissionPaymentId} and status: false not found`);
        }
        Object.assign(commissionPayment, updateCommissionPaymentDTO);
        return await this.commissionPaymentsRepository.save(commissionPayment);
    }
    async removeCommissionPayment(commissionPaymentId) {
        const commissionPayment = await this.commissionPaymentsRepository.findOneBy({
            id: commissionPaymentId,
            status: false,
        });
        if (!commissionPayment) {
            throw new common_1.NotFoundException(`Commission Payment with id: ${commissionPaymentId} and status: false not found`);
        }
        return await this.commissionPaymentsRepository.remove(commissionPayment);
    }
    async changeCommissionPaymentStatus(commissionPaymentId) {
        const commissionPayment = await this.commissionPaymentsRepository.findOneBy({
            id: commissionPaymentId,
        });
        if (!commissionPayment) {
            throw new common_1.NotFoundException(`Commission Payment with id: ${commissionPaymentId} not found`);
        }
        commissionPayment.status = !commissionPayment.status;
        await this.companiesService.changeAccountsBalances({
            sellerId: commissionPayment.sellerId,
            buyerId: commissionPayment.buyerId,
            currencyId: commissionPayment.currencyId,
            status: commissionPayment.status,
            amount: commissionPayment.amount,
        });
        return await this.commissionPaymentsRepository.save(commissionPayment);
    }
};
exports.CommissionPaymentService = CommissionPaymentService;
exports.CommissionPaymentService = CommissionPaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.CommissionPayment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        companies_1.CompaniesService,
        libs_1.LibsService])
], CommissionPaymentService);
//# sourceMappingURL=commission-payment.service.js.map