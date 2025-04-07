import {
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class BaseContractDTO {
  @IsString()
  @Length(1, 32)
  name: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  parentId?: number;

  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsOptional()
  @IsDate()
  signatureDate: Date;

  @IsOptional()
  @IsDate()
  term?: Date;

  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsOptional()
  @IsPositive()
  vat: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  paymentDelay: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  incotermsId: number;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  transportPlace: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  orderPrefix: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  comment: string;
}
