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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const companies_1 = require("../../companies");
const invoice_1 = require("../invoice");
const libs_1 = require("../../libs");
const entities_1 = require("./entities");
const enums_1 = require("../common/enums");
let PaymentService = class PaymentService {
    constructor(paymentsRepository, dataSource, invoiceService, companiesService, libsService) {
        this.paymentsRepository = paymentsRepository;
        this.dataSource = dataSource;
        this.invoiceService = invoiceService;
        this.companiesService = companiesService;
        this.libsService = libsService;
    }
    createBaseQueryBuilder() {
        return this.paymentsRepository.createQueryBuilder('payment');
    }
    applyPaymentListSelect(qb) {
        return qb
            .leftJoin('payment.seller', 'seller')
            .leftJoin('payment.buyer', 'buyer')
            .leftJoin('payment.paymentLines', 'paymentLine')
            .leftJoin('paymentLine.invoice', 'invoice')
            .select([
            'payment.id',
            'payment.status',
            'payment.documentSum',
            'payment.expectedDate',
            'seller.name',
            'buyer.name',
            'paymentLine.id',
            'invoice.invoiceNumber',
        ]);
    }
    applyPaymentDetailSelect(qb) {
        return qb
            .leftJoin('payment.seller', 'seller')
            .leftJoin('payment.buyer', 'buyer')
            .leftJoin('payment.paymentLines', 'paymentLine')
            .leftJoin('paymentLine.invoice', 'invoice')
            .select([
            'payment.id',
            'payment.status',
            'payment.documentSum',
            'payment.expectedDate',
            'seller.name',
            'buyer.name',
            'paymentLine.id',
            'paymentLine.amount',
            'invoice.id',
            'invoice.invoiceNumber',
        ]);
    }
    applyQueryFilter(qb, query) {
        if (!query || Object.keys(query).length === 0) {
            return qb;
        }
        if (query.type) {
            if (query.type === enums_1.DocumentTypeEnum.SELLER) {
                qb.andWhere('contract.sellerId = :sellerId', {
                    sellerId: query.company,
                });
            }
            else {
                qb.andWhere('contract.buyerId = :buyerId', {
                    buyerId: query.company,
                });
            }
        }
        else if (query.company) {
            qb.andWhere('(contract.sellerId = :company OR contract.buyerId = :company)', { company: query.company });
        }
        return qb;
    }
    async getPayments(query) {
        return await this.applyQueryFilter(this.applyPaymentListSelect(this.createBaseQueryBuilder()), query)
            .orderBy('payment.id', 'DESC')
            .getMany();
    }
    async getPaymentById(paymentId) {
        const payment = await this.applyPaymentDetailSelect(this.createBaseQueryBuilder())
            .where('payment.id = :paymentId', { paymentId })
            .getOne();
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with id: ${paymentId} not found`);
        }
        return payment;
    }
    async getPaymentsByInvoiceId(invoiceId) {
        return await this.createBaseQueryBuilder()
            .leftJoin('payment.paymentLines', 'paymentLine')
            .where('paymentLine.invoiceId = :invoiceId', { invoiceId })
            .select(['payment.id', 'payment.status'])
            .orderBy('payment.id', 'ASC')
            .getMany();
    }
    async createPayment(createPaymentDTO) {
        const newPayment = this.paymentsRepository.create(createPaymentDTO);
        newPayment.createdAt = new Date();
        newPayment.comment = newPayment.comment || '';
        newPayment.status = false;
        const { invoiceIds, documentSum } = this.extractPaymentLinesData(newPayment.paymentLines);
        newPayment.documentSum = documentSum;
        newPayment.technicalProcesses =
            await this.libsService.getTechnicalProcessesByInvoiceIds(invoiceIds);
        return await this.paymentsRepository.save(newPayment);
    }
    extractPaymentLinesData(paymentLines) {
        return paymentLines.reduce((acc, cur) => {
            acc.invoiceIds.push(cur.invoiceId);
            acc.documentSum += cur.amount;
            return acc;
        }, { invoiceIds: [], documentSum: 0 });
    }
    async updatePayment(paymentId, updatePaymentDTO) {
        const payment = await this.createBaseQueryBuilder()
            .where('payment.id = :paymentId', { paymentId })
            .andWhere('payment.status = false')
            .leftJoinAndSelect('payment.paymentLines', 'paymentLine')
            .getOne();
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with id: ${paymentId} and status: false not found`);
        }
        const updatedPaymentLinesIds = updatePaymentDTO.paymentLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const paymentLinesToDelete = payment.paymentLines.filter((line) => !updatedPaymentLinesIds.includes(line.id));
        const updated = Object.assign(payment, updatePaymentDTO);
        const { invoiceIds, documentSum } = this.extractPaymentLinesData(updated.paymentLines);
        updated.documentSum = documentSum;
        updated.technicalProcesses =
            await this.libsService.getTechnicalProcessesByInvoiceIds(invoiceIds);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (paymentLinesToDelete.length) {
                await queryRunner.manager.remove(paymentLinesToDelete);
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
    async removePayment(paymentId) {
        const payment = await this.paymentsRepository.findOne({
            where: { id: paymentId, status: false },
            relations: ['paymentLines'],
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with id: ${paymentId} and status: false not found`);
        }
        return await this.paymentsRepository.remove(payment);
    }
    async changePaymentStatus(paymentId) {
        const payment = await this.paymentsRepository.findOne({
            where: { id: paymentId },
            relations: ['paymentLines'],
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with id: ${paymentId} not found`);
        }
        payment.status = !payment.status;
        await this.companiesService.changeAccountsBalances({
            sellerId: payment.sellerId,
            buyerId: payment.buyerId,
            currencyId: payment.currencyId,
            status: payment.status,
            amount: payment.documentSum,
        });
        await this.invoiceService.changePaymentBalance({
            status: payment.status,
            paymentLines: payment.paymentLines,
        });
        return await this.paymentsRepository.save(payment);
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Payment)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => invoice_1.InvoiceService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        invoice_1.InvoiceService,
        companies_1.CompaniesService,
        libs_1.LibsService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map