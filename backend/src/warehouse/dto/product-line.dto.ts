import { IsInt, IsPositive } from 'class-validator';

export class ProductLine {
  @IsPositive()
  @IsInt()
  batchId: number;

  @IsPositive()
  @IsInt()
  packageId: number;

  @IsPositive()
  qty: number;
}
