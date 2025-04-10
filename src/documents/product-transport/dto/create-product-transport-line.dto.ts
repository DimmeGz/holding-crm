import { IsInt, IsPositive } from 'class-validator';

export class CreateProductTransportLineDTO {
  @IsPositive()
  @IsInt()
  productId: number;

  @IsPositive()
  @IsInt()
  batchId: number;

  @IsPositive()
  @IsInt()
  packageId: number;

  @IsPositive()
  @IsInt()
  qty: number;
}
