import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Company } from './entities';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { CompanyType } from './enums';
import { ChangeInvoiceStatusBalanceDTO, MakePaymentDTO } from './dto';

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
      .leftJoinAndSelect('company.warehousesUsage', 'warehousesUsage');
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
    dto: Partial<ChangeInvoiceStatusBalanceDTO | MakePaymentDTO>,
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
      const [sellerAccount, buyerAccount] =
        await this.getSellerBuyerAccounts(dto);

      if (dto.status) {
        sellerAccount.wait += dto.amount;
        buyerAccount.debt -= dto.amount;
      } else {
        sellerAccount.wait -= dto.amount;
        buyerAccount.debt += dto.amount;
      }

      await this.accountsRepository.save([sellerAccount, buyerAccount]);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async changeAccountsBalances(dto: MakePaymentDTO): Promise<void> {
    try {
      const [sellerAccount, buyerAccount] =
        await this.getSellerBuyerAccounts(dto);

      if (dto.status) {
        sellerAccount.wait -= dto.amount;
        sellerAccount.balance += dto.amount;

        buyerAccount.debt -= dto.amount;
        buyerAccount.balance -= dto.amount;
      } else {
        sellerAccount.wait += dto.amount;
        sellerAccount.balance -= dto.amount;

        buyerAccount.debt += dto.amount;
        buyerAccount.balance += dto.amount;
      }

      await this.accountsRepository.save([sellerAccount, buyerAccount]);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
