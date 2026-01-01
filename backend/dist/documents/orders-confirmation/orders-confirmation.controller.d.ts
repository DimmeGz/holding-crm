import { OrdersConfirmationService } from './orders-confirmation.service';
import { OrderConfirmation } from './entities';
import { CreateOrderConfirmationDTO } from './dto';
export declare class OrdersConfirmationController {
    private readonly ordersConfirmationService;
    constructor(ordersConfirmationService: OrdersConfirmationService);
    createOrderConfirmation(createOrderConfirmationDTO: CreateOrderConfirmationDTO): Promise<OrderConfirmation>;
}
