import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Account, Company } from '../companies/entities';
import {
  Batch,
  BatchCustomField,
  CustomField,
  Package,
  Product,
  Service,
} from '../goods/entities';
import {
  CountryOfOrigin,
  Currency,
  CurrencyRate,
  Incoterms,
  TechnicalProcess,
} from '../libs/entities';
import { Warehouse, WarehouseAccounting } from '../warehouse/entities';

import {
  Contract,
  ContractLine,
  ContractServiceLine,
} from '../documents/contracts/entities';
import {
  Order,
  OrderLine,
  OrderServiceLine,
} from '../documents/orders/entities';
import {
  OrderConfirmation,
  OrderConfirmationLine,
} from '../documents/orders-confirmation/entities';
import {
  Invoice,
  InvoiceLine,
  InvoiceServiceLine,
} from '../documents/invoice/entities';
import { CommissionInvoice } from '../documents/commission-invoice/entities';
import { CommissionPayment } from '../documents/commission-payment/entities';
import { Payment, PaymentLine } from '../documents/payment/entities';
import {
  Shipment,
  ShipmentLine,
  ShipmentServiceLine,
} from '../documents/shipment/entities';
import {
  Receive,
  ReceiveLine,
  ReceiveServiceLine,
} from '../documents/receive/entities';
import {
  Production,
  ProductionInLine,
  ProductionOutLine,
} from '../documents/production/entities';
import { TransitLine } from '../documents/transit/entities';
import {
  ProductTransport,
  ProductTransportLine,
  ProductTransportServiceLine,
} from '../documents/product-transport/entities';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('database.host'),
  port: config.get<number>('database.port'),
  username: config.get<string>('database.user'),
  password: config.get<string>('database.password'),
  database: config.get<string>('database.name'),
  entities: [
    Account,
    Batch,
    BatchCustomField,
    CommissionInvoice,
    CommissionPayment,
    Company,
    Contract,
    ContractLine,
    ContractServiceLine,
    CountryOfOrigin,
    Currency,
    CurrencyRate,
    CustomField,
    Incoterms,
    Invoice,
    InvoiceLine,
    InvoiceServiceLine,
    Order,
    OrderLine,
    OrderServiceLine,
    OrderConfirmation,
    OrderConfirmationLine,
    Package,
    Payment,
    PaymentLine,
    Product,
    Production,
    ProductionInLine,
    ProductionOutLine,
    ProductTransport,
    ProductTransportLine,
    ProductTransportServiceLine,
    Receive,
    ReceiveLine,
    ReceiveServiceLine,
    Service,
    Shipment,
    ShipmentLine,
    ShipmentServiceLine,
    TechnicalProcess,
    TransitLine,
    Warehouse,
    WarehouseAccounting,
  ],
});
