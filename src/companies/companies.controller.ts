import { Controller, Get } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  getCompanies(): Promise<any> {
    return this.companiesService.getCompanies();
  }
}
