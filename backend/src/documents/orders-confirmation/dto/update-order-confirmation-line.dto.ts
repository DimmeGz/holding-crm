import { IsInt, IsPositive } from 'class-validator';

import { CreateOrderConfirmationLineDTO } from './create-order-confirmation-line.dto';

export class UpdateOrderConfirmationLineDTO extends CreateOrderConfirmationLineDTO {
  @IsPositive()
  @IsInt()
  id: number;
}
