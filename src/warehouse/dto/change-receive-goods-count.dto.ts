import { ChangeShipGoodsCountDTO } from './change-ship-goods-count.dto';

export class ChangeReceiveGoodsCountDTO extends ChangeShipGoodsCountDTO {
  price: number;
  currencyId: number;
}
