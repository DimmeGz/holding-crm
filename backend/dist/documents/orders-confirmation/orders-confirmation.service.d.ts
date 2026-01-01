import { Repository } from 'typeorm';
import { OrderConfirmation } from './entities';
import { CreateOrderConfirmationDTO } from './dto';
export declare class OrdersConfirmationService {
    private readonly orderConfirmationsRepository;
    constructor(orderConfirmationsRepository: Repository<OrderConfirmation>);
    private createBaseQueryBuilder;
    private applyBaseSelect;
    getConfirmationsByOrderId(orderId: number): Promise<OrderConfirmation[]>;
    createOrderConfirmation(createOrderConfirmationDTO: CreateOrderConfirmationDTO): Promise<OrderConfirmation>;
}
