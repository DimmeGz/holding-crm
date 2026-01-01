import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { ChangeShipGoodsCountDTO } from './change-ship-goods-count.dto';

export class ChangeReceiveGoodsCountDTO extends ChangeShipGoodsCountDTO {
  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsNumber()
  price: number;
}
