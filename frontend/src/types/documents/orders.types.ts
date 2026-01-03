import type { GetCompanyDto } from '@/types/common.types';

export type GetOrdersDto = {
  id: number;
  orderNumber: string;
  documentSum: number;
  seller: GetCompanyDto;
  buyer: GetCompanyDto;
  recipient: GetCompanyDto;
  contract: {
    createdById: number;
    name: string;
  };
  orderProducts: string[];
  expectedDate?: Date;
  confirmExpectedDate?: Date;
  currency: {
    id: number;
    name: string;
  };
  status: boolean;
};
