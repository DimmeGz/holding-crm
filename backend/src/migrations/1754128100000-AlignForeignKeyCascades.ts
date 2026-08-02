import { MigrationInterface, QueryRunner } from 'typeorm';

type FkSpec = {
  table: string;
  constraint: string;
  column: string;
  parentTable: string;
  parentColumn?: string;
};

const CASCADE_FKS: FkSpec[] = [
  {
    table: 'documents_contractline',
    constraint: 'documents_contractli_contract_id_cfa8cc28_fk_documents',
    column: 'contract_id',
    parentTable: 'documents_contract',
  },
  {
    table: 'documents_contractserviceline',
    constraint: 'documents_contractse_contract_id_aa619cbb_fk_documents',
    column: 'contract_id',
    parentTable: 'documents_contract',
  },
  {
    table: 'documents_orderline',
    constraint: 'documents_orderline_order_id_42cbf613_fk_documents_order_id',
    column: 'order_id',
    parentTable: 'documents_order',
  },
  {
    table: 'documents_orderserviceline',
    constraint: 'documents_orderservi_order_id_b3b2b38d_fk_documents',
    column: 'order_id',
    parentTable: 'documents_order',
  },
  {
    table: 'documents_invoiceline',
    constraint: 'documents_invoicelin_invoice_id_f218287f_fk_documents',
    column: 'invoice_id',
    parentTable: 'documents_invoice',
  },
  {
    table: 'documents_invoiceserviceline',
    constraint: 'documents_invoiceser_invoice_id_53cf29af_fk_documents',
    column: 'invoice_id',
    parentTable: 'documents_invoice',
  },
  {
    table: 'documents_commissionpaymentline',
    constraint: 'documents_commission_commission_payment_i_723df661_fk_documents',
    column: 'commission_payment_id',
    parentTable: 'documents_commissionpayment',
  },
  {
    table: 'documents_producttransportline',
    constraint: 'documents_producttra_goods_transport_id_579ac126_fk_documents',
    column: 'goods_transport_id',
    parentTable: 'documents_producttransport',
  },
  {
    table: 'documents_producttransportserviceline',
    constraint: 'documents_producttra_goods_transport_id_61e30318_fk_documents',
    column: 'goods_transport_id',
    parentTable: 'documents_producttransport',
  },
  {
    table: 'documents_productioninline',
    constraint: 'documents_production_production_id_5e05dc8e_fk_documents',
    column: 'production_id',
    parentTable: 'documents_production',
  },
  {
    table: 'documents_productionoutline',
    constraint: 'documents_production_production_id_23a4d983_fk_documents',
    column: 'production_id',
    parentTable: 'documents_production',
  },
  {
    table: 'companies_account',
    constraint: 'companies_account_company_id_439bd2b1_fk_companies_company_id',
    column: 'company_id',
    parentTable: 'companies_company',
  },
  {
    table: 'documents_contract_technical_process',
    constraint: 'documents_contract_t_contract_id_0636d639_fk_documents',
    column: 'contract_id',
    parentTable: 'documents_contract',
  },
  {
    table: 'documents_order_technical_process',
    constraint: 'documents_order_tech_order_id_939964bf_fk_documents',
    column: 'order_id',
    parentTable: 'documents_order',
  },
  {
    table: 'documents_invoice_technical_process',
    constraint: 'documents_invoice_te_invoice_id_ce010c68_fk_documents',
    column: 'invoice_id',
    parentTable: 'documents_invoice',
  },
  {
    table: 'documents_orderconfirmation_technical_process',
    constraint: 'documents_orderconfi_orderconfirmation_id_94560b0a_fk_documents',
    column: 'orderconfirmation_id',
    parentTable: 'documents_orderconfirmation',
  },
  {
    table: 'documents_shipment_technical_process',
    constraint: 'documents_shipment_t_shipment_id_28dfc87d_fk_documents',
    column: 'shipment_id',
    parentTable: 'documents_shipment',
  },
  {
    table: 'documents_receive_technical_process',
    constraint: 'documents_receive_te_receive_id_63b4d959_fk_documents',
    column: 'receive_id',
    parentTable: 'documents_receive',
  },
  {
    table: 'documents_production_technical_process',
    constraint: 'documents_production_production_id_c3f031a7_fk_documents',
    column: 'production_id',
    parentTable: 'documents_production',
  },
  {
    table: 'documents_producttransport_technical_process',
    constraint: 'documents_producttra_producttransport_id_8888bb11_fk_documents',
    column: 'producttransport_id',
    parentTable: 'documents_producttransport',
  },
  {
    table: 'documents_payment_technical_process',
    constraint: 'documents_payment_te_payment_id_88aa108a_fk_documents',
    column: 'payment_id',
    parentTable: 'documents_payment',
  },
  {
    table: 'documents_commissioninvoice_technical_process',
    constraint: 'documents_commission_commissioninvoice_id_a31565bc_fk_documents',
    column: 'commissioninvoice_id',
    parentTable: 'documents_commissioninvoice',
  },
  {
    table: 'documents_commissionpayment_technical_process',
    constraint: 'documents_commission_commissionpayment_id_9d1b5957_fk_documents',
    column: 'commissionpayment_id',
    parentTable: 'documents_commissionpayment',
  },
  {
    table: 'documents_transitline_technical_process',
    constraint: 'documents_transitlin_transitline_id_14477594_fk_documents',
    column: 'transitline_id',
    parentTable: 'documents_transitline',
  },
  {
    table: 'documents_contractfiles',
    constraint: 'documents_contractfi_contract_id_cfc5df34_fk_documents',
    column: 'contract_id',
    parentTable: 'documents_contract',
  },
  {
    table: 'documents_invoicefiles',
    constraint: 'documents_invoicefil_invoice_id_12693812_fk_documents',
    column: 'invoice_id',
    parentTable: 'documents_invoice',
  },
];

async function recreateFk(
  queryRunner: QueryRunner,
  spec: FkSpec,
  onDeleteCascade: boolean,
): Promise<void> {
  const parentColumn = spec.parentColumn ?? 'id';
  const onDelete = onDeleteCascade ? ' ON DELETE CASCADE' : '';

  await queryRunner.query(
    `ALTER TABLE "${spec.table}" DROP CONSTRAINT "${spec.constraint}"`,
  );
  await queryRunner.query(`
    ALTER TABLE "${spec.table}"
    ADD CONSTRAINT "${spec.constraint}"
    FOREIGN KEY ("${spec.column}")
    REFERENCES "${spec.parentTable}"("${parentColumn}")
    ${onDelete}
    DEFERRABLE INITIALLY DEFERRED
  `);
}

export class AlignForeignKeyCascades1754128100000
  implements MigrationInterface
{
  name = 'AlignForeignKeyCascades1754128100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const spec of CASCADE_FKS) {
      await recreateFk(queryRunner, spec, true);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const spec of CASCADE_FKS) {
      await recreateFk(queryRunner, spec, false);
    }
  }
}
