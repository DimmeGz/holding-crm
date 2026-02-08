import { Invoice } from '../../../invoices/entities';
import { OrderConfirmation } from '../../../orders-confirmation/entities';
import { Order } from '../../entities';

export class GetOrderResponseDTO {
  order: Order;
  invoices: Invoice[];
  orderConfirmations: OrderConfirmation[];
}
