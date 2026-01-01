import { IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { ProductLine } from './product-line.dto';
import { Type } from 'class-transformer';

export class TransportProductsDTO {
  @IsPositive()
  @IsInt()
  companyId: number;

  @IsPositive()
  @IsInt()
  warehouseSenderId: number;

  @IsPositive()
  @IsInt()
  warehouseReceiveId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductLine)
  transportLines: ProductLine[];

  @IsPositive()
  transportCost: number;
}
