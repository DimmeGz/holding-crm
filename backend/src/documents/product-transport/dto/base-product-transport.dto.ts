import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class BaseProductTransportDTO {
  @IsPositive()
  @IsInt()
  companyId: number;

  @IsPositive()
  @IsInt()
  warehouseSenderId: number;

  @IsPositive()
  @IsInt()
  warehouseReceiveId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedDate: Date;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  comment: string;
}
