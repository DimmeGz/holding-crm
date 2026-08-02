import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Company } from './entities';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { CompanyType } from './enums';
import {
  ChangeInvoiceStatusBalanceDTO,
  MakePaymentDTO,
  GetSellerBuyerAccountsDTO,
} from './dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  private createBaseCompanyQueryBuilder(): SelectQueryBuilder<Company> {
    return this.companiesRepository
      .createQueryBuilder('company')
      .where('company.companyType = :companyType', {
        companyType: CompanyType.INNER_COMPANY,
      });
  }

  private applyCompanyListSelect(
    qb: SelectQueryBuilder<Company>,
  ): SelectQueryBuilder<Company> {
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

  private createBaseAccountQueryBuilder(): SelectQueryBuilder<Account> {
    return this.accountsRepository.createQueryBuilder('account');
  }

  async getCompanies(): Promise<Company[]> {
    return await this.applyCompanyListSelect(
      this.createBaseCompanyQueryBuilder(),
    ).getMany();
  }

  private async getSellerBuyerAccounts(
    dto: GetSellerBuyerAccountsDTO,
  ): Promise<[Account, Account]> {
    const sellerAccount = await this.createBaseAccountQueryBuilder()
      .where('account.companyId = :companyId', {
        companyId: dto.sellerId,
      })
      .andWhere('account.currencyId = :currencyId', {
        currencyId: dto.currencyId,
      })
      .getOne();

    if (!sellerAccount) {
      throw new NotFoundException(`Seller account not found`);
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
      throw new NotFoundException(`Buyer account not found`);
    }

    return [sellerAccount, buyerAccount];
  }

  async changeInvoiceStatusBalances(
    dto: ChangeInvoiceStatusBalanceDTO,
  ): Promise<void> {
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
      } else {
        sellerAccount.wait -= amount;
        buyerAccount.debt += amount;
      }

      await this.accountsRepository.save([sellerAccount, buyerAccount]);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async changeAccountsBalances(dto: MakePaymentDTO): Promise<void> {
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
      } else {
        sellerAccount.wait += amount;
        sellerAccount.balance -= amount;

        buyerAccount.debt += amount;
        buyerAccount.balance += amount;
      }

      await this.accountsRepository.save([sellerAccount, buyerAccount]);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getCompanyType(companyId: number): Promise<CompanyType> {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
      select: ['id', 'companyType'],
    });

    if (!company) {
      throw new NotFoundException(`Company with id ${companyId} not found`);
    }

    return company.companyType;
  }

  async getCompanyById(companyId: number): Promise<Company> {
    const company = await this.companiesRepository
      .createQueryBuilder('company')
      .where('company.id = :companyId', { companyId })
      .leftJoin(
        'company.accounts',
        'account',
        'account.balance != 0 OR account.debt != 0 OR account.wait != 0',
      )
      .leftJoin('account.currency', 'currency')
      .leftJoin(
        'company.incomeInvoices',
        'incomeInvoice',
        'incomeInvoice.status = true AND incomeInvoice.paymentBalance > 0',
      )
      .leftJoin('incomeInvoice.seller', 'seller')
      .leftJoin(
        'company.outcomeInvoices',
        'outcomeInvoice',
        'outcomeInvoice.status = true AND outcomeInvoice.paymentBalance > 0',
      )
      .leftJoin('outcomeInvoice.buyer', 'buyer')
      .select([
        'company.id',
        'company.name',
        'company.defaultWarehouseId',
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
      throw new NotFoundException(`Company with id ${companyId} not found`);
    }

    if (company.incomeInvoices.length) {
      company.incomeInvoices = company.incomeInvoices.sort(
        (a, b) =>
          a.sellerId - b.sellerId ||
          new Date(b.expectedDate).getTime() -
            new Date(a.expectedDate).getTime(),
      );
    }

    if (company.outcomeInvoices.length) {
      company.outcomeInvoices = company.outcomeInvoices.sort(
        (a, b) =>
          a.buyerId - b.buyerId ||
          new Date(b.expectedDate).getTime() -
            new Date(a.expectedDate).getTime(),
      );
    }

    return company;
  }

  async getStoreData() {
    return await this.companiesRepository
      .createQueryBuilder('company')
      .select(['company.id', 'company.name', 'company.companyType'])
      .getMany();
  }
}
