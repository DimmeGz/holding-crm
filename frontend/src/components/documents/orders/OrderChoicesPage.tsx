import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Group, Select, Tooltip } from '@mantine/core';
import {
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
  type MRT_TableOptions,
} from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useOrdersColumns } from '@/hooks/documents/table-columns/useOrderColumns';
import { useOrders } from '@/hooks/documents/useOrders';
import { useLibsStore } from '@/stores/useLibsStore';
import type { GetOrdersDto } from '@/types/documents/orders.types';

export function OrderChoicesPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const companies = useLibsStore(s => s.companies);
  const companyOptions = useMemo(() => recordToSelectData(companies), [companies]);

  const sellerId = searchParams.get('sellerId') ?? null;
  const buyerId = searchParams.get('buyerId') ?? null;
  const recipientId = searchParams.get('recipientId') ?? null;

  const [filterSellerId, setFilterSellerId] = useState<string | null>(sellerId);
  const [filterBuyerId, setFilterBuyerId] = useState<string | null>(buyerId);
  const [filterRecipientId, setFilterRecipientId] = useState<string | null>(
    recipientId,
  );
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const canSelect = Boolean(sellerId && buyerId);

  const query = useMemo(
    () => ({
      status: false,
      hidden: false,
      ...(sellerId ? { sellerId: Number(sellerId) } : {}),
      ...(buyerId ? { buyerId: Number(buyerId) } : {}),
      ...(recipientId ? { recipientId: Number(recipientId) } : {}),
    }),
    [buyerId, recipientId, sellerId],
  );

  const { data, loading, error } = useOrders(query);
  const columns: MRT_ColumnDef<GetOrdersDto>[] = useOrdersColumns();

  const tableConfig: MRT_TableOptions<GetOrdersDto> = {
    data: data ?? [],
    columns,
    getRowId: row => String(row.id),
    enableRowSelection: canSelect,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    mantineTableContainerProps: {
      style: {
        height: '75vh',
      },
    },
  };

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const next = new URLSearchParams();

    if (filterSellerId) {
      next.set('sellerId', filterSellerId);
    }

    if (filterBuyerId) {
      next.set('buyerId', filterBuyerId);
    }

    if (filterRecipientId) {
      next.set('recipientId', filterRecipientId);
    }

    setRowSelection({});
    setSearchParams(next);
  };

  const selectedOrderIds = Object.keys(rowSelection).filter(
    key => rowSelection[key],
  );

  const handleCreateInvoice = (): void => {
    if (selectedOrderIds.length === 0) {
      return;
    }

    navigate(
      `${UrlConstants.INVOICES_URL}/new?orderIds=${selectedOrderIds.join(',')}`,
    );
  };

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && (
        <HoldingTable
          tableOptions={tableConfig}
          title={t('documents:documents.orderChoices')}
          toolBarControls={
            <form onSubmit={handleFilterSubmit}>
              <Group gap='xs' align='flex-end'>
                <Select
                  label={t('documents:documents.seller')}
                  data={companyOptions}
                  value={filterSellerId}
                  onChange={setFilterSellerId}
                  searchable
                  clearable
                  w={180}
                />
                <Select
                  label={t('documents:documents.buyer')}
                  data={companyOptions}
                  value={filterBuyerId}
                  onChange={setFilterBuyerId}
                  searchable
                  clearable
                  w={180}
                />
                <Select
                  label={t('documents:documents.recipient')}
                  data={companyOptions}
                  value={filterRecipientId}
                  onChange={setFilterRecipientId}
                  searchable
                  clearable
                  w={180}
                />
                <Button type='submit' variant='light'>
                  {t('documents:documents.filter')}
                </Button>
                <Button
                  disabled={!canSelect || selectedOrderIds.length === 0}
                  onClick={handleCreateInvoice}
                >
                  {t('documents:documents.createInvoiceFromOrders')}
                </Button>
                <Tooltip label={t('common:actions.comingSoon')}>
                  <Button disabled>{t('documents:documents.print')}</Button>
                </Tooltip>
              </Group>
            </form>
          }
        />
      )}
    </>
  );
}
