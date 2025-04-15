import { IsInt, IsPositive } from 'class-validator';

export class ChangeShipGoodsCountDTO {
  @IsPositive()
  @IsInt()
  companyId: number;

  @IsPositive()
  @IsInt()
  warehouseId: number;

  @IsPositive()
  @IsInt()
  batchId: number;

  @IsPositive()
  @IsInt()
  packageId: number;

  @IsPositive()
  qty: number;
}
