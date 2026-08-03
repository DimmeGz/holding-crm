import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Button, Group, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CompanyType } from '@/constants/company-type.constants';
import { useWarehouseColumns } from '@/hooks/warehouse/table-columns/useWarehouseColumns';
import { useWarehouse } from '@/hooks/warehouse/useWarehouse';
import { useLibsStore } from '@/stores/useLibsStore';
import type { GetWarehouseAccountingDto } from '@/types/warehouse/warehouse.types';

function parseOptionalId(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function WarehouseTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables', 'documents']);
  const [searchParams, setSearchParams] = useSearchParams();
  const companies = useLibsStore((s) => s.companies);
  const companyTypes = useLibsStore((s) => s.companyTypes);
  const technicalProcesses = useLibsStore((s) => s.technicalProcesses);

  const query = useMemo(
    () => ({
      company: parseOptionalId(searchParams.get('company')),
      warehouse: parseOptionalId(searchParams.get('warehouse')),
      process: parseOptionalId(searchParams.get('process')),
    }),
    [searchParams],
  );

  const { data, loading, error } = useWarehouse(query);
  const columns: MRT_ColumnDef<GetWarehouseAccountingDto>[] =
    useWarehouseColumns();

  const visibleRows = useMemo(() => {
    const rows = data ?? [];
    return rows.filter((row) => {
      const type =
        row.company?.companyType ?? companyTypes[row.company?.id ?? 0];
      return type !== CompanyType.MANUFACTURER && type !== CompanyType.BUYER;
    });
  }, [companyTypes, data]);

  const totals = useMemo(() => {
    let weight = 0;
    let sum = 0;

    for (const row of visibleRows) {
      const type =
        row.company?.companyType ?? companyTypes[row.company?.id ?? 0];
      if (type !== CompanyType.INNER_COMPANY) {
        continue;
      }

      weight += row.qty;
      sum += row.qty * row.cost;
    }

    return { weight, sum };
  }, [companyTypes, visibleRows]);

  const title = useMemo(() => {
    const parts = [t('common:nav.warehouse')];

    if (query.company && companies[query.company]) {
      parts.push(companies[query.company]);
    }

    if (query.process && technicalProcesses[query.process]) {
      parts.push(technicalProcesses[query.process]);
    }

    return parts.join(' || ');
  }, [companies, query.company, query.process, t, technicalProcesses]);

  const processEntries = useMemo(
    () =>
      Object.entries(technicalProcesses).map(([id, name]) => ({
        id: Number(id),
        name,
      })),
    [technicalProcesses],
  );

  const handleProcessClick = (processId: number): void => {
    const next = new URLSearchParams(searchParams);
    if (query.process === processId) {
      next.delete('process');
    } else {
      next.set('process', String(processId));
    }
    setSearchParams(next);
  };

  const tableConfig: MRT_TableOptions<GetWarehouseAccountingDto> = {
    data: visibleRows,
    columns,
    mantineTableContainerProps: {
      style: {
        height: '80vh',
      },
    },
    renderBottomToolbarCustomActions: () => (
      <Group gap='xl' ml='md'>
        <Text size='sm' fw={600}>
          {t('tables:columns.qty')}: {totals.weight}
        </Text>
        <Text size='sm' fw={600}>
          {t('tables:columns.totalCost')}: {totals.sum.toFixed(2)} EUR
        </Text>
      </Group>
    ),
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
        <>
          {processEntries.length > 0 && (
            <Group gap='xs' mb='sm' ml='xs'>
              {processEntries.map((process) => (
                <Button
                  key={process.id}
                  size='xs'
                  variant={
                    query.process === process.id ? 'filled' : 'light'
                  }
                  onClick={() => handleProcessClick(process.id)}
                >
                  {process.name}
                </Button>
              ))}
            </Group>
          )}

          <HoldingTable tableOptions={tableConfig} title={title} />
        </>
      )}
    </>
  );
}
