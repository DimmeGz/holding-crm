import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Company } from './entities';
import { Repository } from 'typeorm';

import { CompanyType } from './enums';
import { ChangeAccountBalanceDTO, MakePaymentDTO } from './dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async getCompanies(): Promise<Company[]> {
    return await this.companiesRepository
      .createQueryBuilder('company')
      .where('company.companyType = :companyType', {
        companyType: CompanyType.INNER_COMPANY,
      })
      .leftJoinAndSelect('company.accounts', 'accounts')
      .leftJoinAndSelect('accounts.currency', 'currency')
      .leftJoinAndSelect('company.defaultWarehouse', 'defaultWarehouse')
      .leftJoinAndSelect('company.warehousesUsage', 'warehousesUsage')
      .getMany();
  }

  async changeAccountWaitBallance(
    changeAccountBalanceDTO: ChangeAccountBalanceDTO,
  ): Promise<void> {
    const account = await this.getAccount(
      changeAccountBalanceDTO.companyId,
      changeAccountBalanceDTO.currencyId,
    );

    account.wait = account.wait + changeAccountBalanceDTO.value;

    await this.accountsRepository.save(account);
    return;
  }

  async changeAccountDebtBallance(
    changeAccountBalanceDTO: ChangeAccountBalanceDTO,
  ): Promise<void> {
    const account = await this.getAccount(
      changeAccountBalanceDTO.companyId,
      changeAccountBalanceDTO.currencyId,
    );
    account.debt = account.debt + changeAccountBalanceDTO.value;

    await this.accountsRepository.save(account);
    return;
  }

  private async getAccount(companyId: number, currencyId: number) {
    return await this.accountsRepository.findOneBy({
      companyId,
      currencyId,
    });
  }

  async makePayment(makePaymentDTO: MakePaymentDTO) {
    const [sellerAccount, buyerAccount] =
      await this.getSellerBuyerAccounts(makePaymentDTO);

    if (makePaymentDTO.status) {
      sellerAccount.wait -= makePaymentDTO.amount;
      sellerAccount.balance += makePaymentDTO.amount;

      buyerAccount.debt -= makePaymentDTO.amount;
      buyerAccount.balance -= makePaymentDTO.amount;
    } else {
      sellerAccount.wait += makePaymentDTO.amount;
      sellerAccount.balance -= makePaymentDTO.amount;

      buyerAccount.debt += makePaymentDTO.amount;
      buyerAccount.balance += makePaymentDTO.amount;
    }

    await this.accountsRepository.save([sellerAccount, buyerAccount]);
  }

  private async getSellerBuyerAccounts(
    makePaymentDTO: MakePaymentDTO,
  ): Promise<Account[]> {
    const sellerAccount = await this.accountsRepository
      .createQueryBuilder('account')
      .where('account.companyId = :companyId', {
        companyId: makePaymentDTO.sellerId,
      })
      .andWhere('account.currencyId = :currencyId', {
        currencyId: makePaymentDTO.currencyId,
      })
      .getOne();

    const buyerAccount = await this.accountsRepository
      .createQueryBuilder('account')
      .where('account.companyId = :companyId', {
        companyId: makePaymentDTO.buyerId,
      })
      .andWhere('account.currencyId = :currencyId', {
        currencyId: makePaymentDTO.currencyId,
      })
      .getOne();

    return [sellerAccount, buyerAccount];
  }
}
