import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateOrderLineDTO {
  @IsPositive()
  @IsInt()
  productManId: number;

  @IsPositive()
  @IsInt()
  productBuyId: number;

  @IsPositive()
  @IsInt()
  packageId: number;

  @IsPositive()
  @IsInt()
  qty: number;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 3 })
  price: number;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  batchRename: string;
}
