import { Invoice } from '../../entities';
import { CommissionInvoice } from '../../../commission-invoice/entities';
import { Payment } from '../../../payment/entities';
import { Shipment } from '../../../shipment/entities';
export declare class GetInvoiceResponseDTO {
    invoice: Invoice;
    shipments: Shipment[];
    payments: Payment[];
    commissions: Partial<CommissionInvoice>[];
    childInvoices: Invoice[];
}
