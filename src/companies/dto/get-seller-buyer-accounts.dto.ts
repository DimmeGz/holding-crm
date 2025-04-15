import { IsInt, IsPositive } from 'class-validator';

export class GetSellerBuyerAccountsDTO {
  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsPositive()
  @IsInt()
  currencyId: number;
}
