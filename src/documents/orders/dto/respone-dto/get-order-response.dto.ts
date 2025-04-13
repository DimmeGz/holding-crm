import { Invoice } from '../../../invoice/entities';
import { OrderConfirmation } from '../../../orders-confirmation/entities';
import { Order } from '../../entities';

export class GetOrderResponseDTO {
  order: Order;
  invoices: Invoice[];
  orderConfirmations: OrderConfirmation[];
}
