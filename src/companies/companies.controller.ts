import { Controller, Get, Param, ParseIntPipe, UsePipes } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  getCompanies(): Promise<any> {
    return this.companiesService.getCompanies();
  }

  @Get(':companyId')
  @UsePipes(new ParseIntPipe())
  getCompanyById(@Param('companyId') companyId: number) {
    return this.companiesService.getCompanyById(companyId);
  }
}
