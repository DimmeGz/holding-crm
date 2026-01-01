"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const entities_1 = require("../companies/entities");
const entities_2 = require("../goods/entities");
const entities_3 = require("../libs/entities");
const entities_4 = require("../warehouse/entities");
const entities_5 = require("../documents/contracts/entities");
const entities_6 = require("../documents/orders/entities");
const entities_7 = require("../documents/orders-confirmation/entities");
const entities_8 = require("../documents/invoice/entities");
const entities_9 = require("../documents/commission-invoice/entities");
const entities_10 = require("../documents/commission-payment/entities");
const entities_11 = require("../documents/payment/entities");
const entities_12 = require("../documents/shipment/entities");
const entities_13 = require("../documents/receive/entities");
const entities_14 = require("../documents/production/entities");
const entities_15 = require("../documents/transit/entities");
const entities_16 = require("../documents/product-transport/entities");
const typeOrmConfig = (config) => ({
    type: 'postgres',
    host: config.get('database.host'),
    port: config.get('database.port'),
    username: config.get('database.user'),
    password: config.get('database.password'),
    database: config.get('database.name'),
    entities: [
        entities_1.Account,
        entities_2.Batch,
        entities_2.BatchCustomField,
        entities_9.CommissionInvoice,
        entities_10.CommissionPayment,
        entities_1.Company,
        entities_5.Contract,
        entities_5.ContractLine,
        entities_5.ContractServiceLine,
        entities_3.CountryOfOrigin,
        entities_3.Currency,
        entities_3.CurrencyRate,
        entities_2.CustomField,
        entities_3.Incoterms,
        entities_8.Invoice,
        entities_8.InvoiceLine,
        entities_8.InvoiceServiceLine,
        entities_6.Order,
        entities_6.OrderLine,
        entities_6.OrderServiceLine,
        entities_7.OrderConfirmation,
        entities_7.OrderConfirmationLine,
        entities_2.Package,
        entities_11.Payment,
        entities_11.PaymentLine,
        entities_2.Product,
        entities_14.Production,
        entities_14.ProductionInLine,
        entities_14.ProductionOutLine,
        entities_16.ProductTransport,
        entities_16.ProductTransportLine,
        entities_16.ProductTransportServiceLine,
        entities_13.Receive,
        entities_13.ReceiveLine,
        entities_13.ReceiveServiceLine,
        entities_2.Service,
        entities_12.Shipment,
        entities_12.ShipmentLine,
        entities_12.ShipmentServiceLine,
        entities_3.TechnicalProcess,
        entities_15.TransitLine,
        entities_4.Warehouse,
        entities_4.WarehouseAccounting,
    ],
});
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map