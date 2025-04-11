import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Company } from './entities';
import { Repository } from 'typeorm';

import { CompanyType } from './enums';

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
    companyId: number,
    currencyId: number,
    value: number,
  ): Promise<void> {
    const account = await this.getAccount(companyId, currencyId);

    account.wait = account.wait + value;

    await this.accountsRepository.save(account);
    return;
  }

  async changeAccountDebtBallance(
    companyId: number,
    currencyId: number,
    value: number,
  ): Promise<void> {
    const account = await this.getAccount(companyId, currencyId);
    account.debt = account.debt + value;

    await this.accountsRepository.save(account);
    return;
  }

  private async getAccount(companyId: number, currencyId: number) {
    return await this.accountsRepository.findOneBy({
      companyId,
      currencyId,
    });
  }
}
