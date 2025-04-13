import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Company } from './entities';
import { Repository } from 'typeorm';

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

  async changeInvoiceStatusBalances(
    changeInvoiceStatusBalanceDTO: ChangeInvoiceStatusBalanceDTO,
  ): Promise<void> {
    const [sellerAccount, buyerAccount] = await this.getSellerBuyerAccounts(
      changeInvoiceStatusBalanceDTO,
    );

    if (changeInvoiceStatusBalanceDTO.status) {
      sellerAccount.wait += changeInvoiceStatusBalanceDTO.amount;
      buyerAccount.debt -= changeInvoiceStatusBalanceDTO.amount;
    } else {
      sellerAccount.wait -= changeInvoiceStatusBalanceDTO.amount;
      buyerAccount.debt += changeInvoiceStatusBalanceDTO.amount;
    }

    await this.accountsRepository.save([sellerAccount, buyerAccount]);
  }

  async makePayment(makePaymentDTO: MakePaymentDTO): Promise<void> {
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
    makePaymentDTO: Partial<MakePaymentDTO>,
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
