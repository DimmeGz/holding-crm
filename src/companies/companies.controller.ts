import { Controller, Get, Param, ParseIntPipe, UsePipes } from '@nestjs/common';

import { CompaniesService } from './companies.service';

import { Company } from './entities';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  getCompanies(): Promise<Company[]> {
    return this.companiesService.getCompanies();
  }

  @Get(':companyId')
  @UsePipes(new ParseIntPipe())
  getCompanyById(@Param('companyId') companyId: number): Promise<Company> {
    return this.companiesService.getCompanyById(companyId);
  }
}
