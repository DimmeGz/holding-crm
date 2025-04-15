import { IsInt, IsPositive } from 'class-validator';

export class GetWareCostDTO {
  @IsPositive()
  @IsInt()
  productId?: number;

  @IsPositive()
  @IsInt()
  batchId?: number;

  @IsPositive()
  @IsInt()
  packageId?: number;

  @IsPositive()
  @IsInt()
  warehouseId?: number;

  @IsPositive()
  @IsInt()
  companyId?: number;

  @IsPositive()
  @IsInt()
  currencyId?: number;
}
