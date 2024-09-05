import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities';
import { Repository } from 'typeorm';
import { CompanyType } from './enums';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly usersRepository: Repository<Company>,
  ) {}

  async getCompanies(): Promise<Company[]> {
    return await this.usersRepository
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
}
