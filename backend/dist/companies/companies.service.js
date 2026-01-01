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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const typeorm_2 = require("typeorm");
const enums_1 = require("./enums");
let CompaniesService = class CompaniesService {
    constructor(companiesRepository, accountsRepository) {
        this.companiesRepository = companiesRepository;
        this.accountsRepository = accountsRepository;
    }
    createBaseCompanyQueryBuilder() {
        return this.companiesRepository
            .createQueryBuilder('company')
            .where('company.companyType = :companyType', {
            companyType: enums_1.CompanyType.INNER_COMPANY,
        });
    }
    applyCompanyListSelect(qb) {
        return qb
            .leftJoinAndSelect('company.accounts', 'accounts')
            .leftJoinAndSelect('accounts.currency', 'currency')
            .leftJoinAndSelect('company.defaultWarehouse', 'defaultWarehouse')
            .leftJoinAndSelect('company.warehousesUsage', 'warehousesUsage')
            .select([
            'company.id',
            'company.name',
            'accounts.id',
            'accounts.balance',
            'accounts.debt',
            'accounts.wait',
            'currency.id',
            'currency.name',
            'defaultWarehouse.id',
            'defaultWarehouse.name',
            'warehousesUsage.id',
            'warehousesUsage.name',
        ]);
    }
    createBaseAccountQueryBuilder() {
        return this.accountsRepository.createQueryBuilder('account');
    }
    async getCompanies() {
        return await this.applyCompanyListSelect(this.createBaseCompanyQueryBuilder()).getMany();
    }
    async getSellerBuyerAccounts(dto) {
        const sellerAccount = await this.createBaseAccountQueryBuilder()
            .where('account.companyId = :companyId', {
            companyId: dto.sellerId,
        })
            .andWhere('account.currencyId = :currencyId', {
            currencyId: dto.currencyId,
        })
            .getOne();
        if (!sellerAccount) {
            throw new common_1.NotFoundException(`Seller account not found`);
        }
        const buyerAccount = await this.createBaseAccountQueryBuilder()
            .where('account.companyId = :companyId', {
            companyId: dto.buyerId,
        })
            .andWhere('account.currencyId = :currencyId', {
            currencyId: dto.currencyId,
        })
            .getOne();
        if (!buyerAccount) {
            throw new common_1.NotFoundException(`Buyer account not found`);
        }
        return [sellerAccount, buyerAccount];
    }
    async changeInvoiceStatusBalances(dto) {
        try {
            const { sellerId, buyerId, currencyId, status, amount } = dto;
            const [sellerAccount, buyerAccount] = await this.getSellerBuyerAccounts({
                sellerId,
                buyerId,
                currencyId,
            });
            if (status) {
                sellerAccount.wait += amount;
                buyerAccount.debt -= amount;
            }
            else {
                sellerAccount.wait -= amount;
                buyerAccount.debt += amount;
            }
            await this.accountsRepository.save([sellerAccount, buyerAccount]);
        }
        catch (e) {
            throw new common_1.BadRequestException(e);
        }
    }
    async changeAccountsBalances(dto) {
        try {
            const { sellerId, buyerId, currencyId, status, amount } = dto;
            const [sellerAccount, buyerAccount] = await this.getSellerBuyerAccounts({
                sellerId,
                buyerId,
                currencyId,
            });
            if (status) {
                sellerAccount.wait -= amount;
                sellerAccount.balance += amount;
                buyerAccount.debt -= amount;
                buyerAccount.balance -= amount;
            }
            else {
                sellerAccount.wait += amount;
                sellerAccount.balance -= amount;
                buyerAccount.debt += amount;
                buyerAccount.balance += amount;
            }
            await this.accountsRepository.save([sellerAccount, buyerAccount]);
        }
        catch (e) {
            throw new common_1.BadRequestException(e);
        }
    }
    async getCompanyById(companyId) {
        const company = await this.companiesRepository
            .createQueryBuilder('company')
            .where('company.id = :companyId', { companyId })
            .leftJoin('company.accounts', 'account', 'account.balance != 0 OR account.debt != 0 OR account.wait != 0')
            .leftJoin('account.currency', 'currency')
            .leftJoin('company.incomeInvoices', 'incomeInvoice', 'incomeInvoice.status = true AND incomeInvoice.paymentBalance > 0')
            .leftJoin('incomeInvoice.seller', 'seller')
            .leftJoin('company.outcomeInvoices', 'outcomeInvoice', 'outcomeInvoice.status = true AND outcomeInvoice.paymentBalance > 0')
            .leftJoin('outcomeInvoice.buyer', 'buyer')
            .select([
            'company.id',
            'company.name',
            'account.id',
            'account.balance',
            'account.debt',
            'account.wait',
            'currency.id',
            'currency.name',
            'incomeInvoice.id',
            'incomeInvoice.invoiceNumber',
            'incomeInvoice.paymentBalance',
            'incomeInvoice.expectedDate',
            'seller.id',
            'seller.name',
            'outcomeInvoice.id',
            'outcomeInvoice.invoiceNumber',
            'outcomeInvoice.paymentBalance',
            'outcomeInvoice.expectedDate',
            'buyer.id',
            'buyer.name',
        ])
            .getOne();
        if (!company) {
            throw new common_1.NotFoundException(`Company with id ${companyId} not found`);
        }
        if (company.incomeInvoices.length) {
            company.incomeInvoices = company.incomeInvoices.sort((a, b) => a.sellerId - b.sellerId ||
                new Date(b.expectedDate).getTime() -
                    new Date(a.expectedDate).getTime());
        }
        if (company.outcomeInvoices.length) {
            company.outcomeInvoices = company.outcomeInvoices.sort((a, b) => a.buyerId - b.buyerId ||
                new Date(b.expectedDate).getTime() -
                    new Date(a.expectedDate).getTime());
        }
        return company;
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Company)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Account)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map