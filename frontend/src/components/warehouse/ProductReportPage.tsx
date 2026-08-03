import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Stack, Title } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { useReportInvoiceColumns } from '@/hooks/warehouse/table-columns/useReportInvoiceColumns';
import { useReportProductionColumns } from '@/hooks/warehouse/table-columns/useReportProductionColumns';
import { useProductReport } from '@/hooks/warehouse/useProductReport';
import type {
  ReportInvoiceLine,
  ReportProductionLine,
} from '@/types/warehouse/warehouse.types';

export function ProductReportPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data, loading, error } = useProductReport(productId);

  const invoiceColumns: MRT_ColumnDef<ReportInvoiceLine>[] =
    useReportInvoiceColumns({ linkProduct: false, linkBatch: true });
  const productionOutColumns: MRT_ColumnDef<ReportProductionLine>[] =
    useReportProductionColumns({
      linkProduct: false,
      linkBatch: true,
      showDate: true,
    });
  const productionInColumns: MRT_ColumnDef<ReportProductionLine>[] =
    useReportProductionColumns({
      linkProduct: false,
      linkBatch: true,
      showDate: false,
    });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <h3>
        {t('common:messages.error')} {error}
      </h3>
    );
  }

  if (!data) {
    return <h3>{t('common:messages.noData')}</h3>;
  }

  const invoiceTable: MRT_TableOptions<ReportInvoiceLine> = {
    data: data.invoiceLines ?? [],
    columns: invoiceColumns,
    enablePagination: false,
    enableBottomToolbar: false,
  };

  const productionOutTable: MRT_TableOptions<ReportProductionLine> = {
    data: data.productionOutLines ?? [],
    columns: productionOutColumns,
    enablePagination: false,
    enableBottomToolbar: false,
  };

  const productionInTable: MRT_TableOptions<ReportProductionLine> = {
    data: data.productionInLines ?? [],
    columns: productionInColumns,
    enablePagination: false,
    enableBottomToolbar: false,
  };

  return (
    <Stack gap='lg' p='md'>
      <Title order={2}>
        {data.product.name} ({t('documents:documents.productReport')})
      </Title>

      {(data.invoiceLines?.length ?? 0) > 0 && (
        <HoldingTable
          tableOptions={invoiceTable}
          title={t('common:nav.invoices')}
        />
      )}

      {(data.productionOutLines?.length ?? 0) > 0 && (
        <HoldingTable
          tableOptions={productionOutTable}
          title={`${t('common:nav.production')} (${t('documents:documents.productionOut')})`}
        />
      )}

      {(data.productionInLines?.length ?? 0) > 0 && (
        <HoldingTable
          tableOptions={productionInTable}
          title={`${t('common:nav.production')} (${t('documents:documents.productionIn')})`}
        />
      )}

      {!data.invoiceLines?.length &&
        !data.productionOutLines?.length &&
        !data.productionInLines?.length && (
          <h3>{t('common:messages.noData')}</h3>
        )}
    </Stack>
  );
}
