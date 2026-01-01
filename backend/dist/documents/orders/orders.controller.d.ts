import { OrdersService } from './orders.service';
import { Order } from './entities';
import { CreateOrderDTO, UpdateOrderDTO } from './dto';
import { GetOrdersQueryDTO } from './dto/query-dto';
import { GetOrderResponseDTO } from './dto/respone-dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getOrders(query?: GetOrdersQueryDTO): Promise<Order[]>;
    getOrderById(orderId: number): Promise<GetOrderResponseDTO>;
    createOrder(createOrderDTO: CreateOrderDTO): Promise<Order>;
    updateOrder(orderId: number, updateOrderDTO: UpdateOrderDTO): Promise<Order>;
    removeOrder(orderId: number): Promise<Order>;
    changeContractStatus(orderId: number): Promise<Order>;
}
