import {
  type ChangeEvent,
  type ReactNode,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Group, Switch } from '@mantine/core';
import {
  type MRT_ColumnDef,
  MRT_ExpandButton,
  type MRT_TableOptions,
} from 'mantine-react-table';
import {
  ProcessFilters,
  TypeFilters,
} from '@/components/documents/common/DocumentListFilters';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import {
  parseContractType,
  parsePositiveInt,
  type DocumentTypeParam,
} from '@/helpers/documents-query.helpers';
import { useContractColumns } from '@/hooks/documents/table-columns/useContractColumns';
import { useContracts } from '@/hooks/documents/useContracts';
import { useLibsStore } from '@/stores/useLibsStore';
import type { GetContractsDto } from '@/types/documents/contracts.types';

export function ContractsTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const companies = useLibsStore((s) => s.companies);
  const technicalProcesses = useLibsStore((s) => s.technicalProcesses);
  const [withArchived, setWithArchived] = useState(false);

  const query = useMemo(
    () => ({
      company: parsePositiveInt(searchParams.get('company')),
      type: parseContractType(searchParams.get('type')),
      process: parsePositiveInt(searchParams.get('process')),
    }),
    [searchParams],
  );

  const { data, loading, error } = useContracts(query);
  const columns: MRT_ColumnDef<GetContractsDto>[] = useContractColumns();

  const actualContracts: GetContractsDto[] = useMemo(() => {
    if (!data) return [];

    return data
      .filter(
        (contract) =>
          !contract.isArchived ||
          contract.children?.some((child) => !child.isArchived),
      )
      .map((contract) => ({
        ...contract,
        children: contract.children?.filter((child) => !child.isArchived) || [],
      }));
  }, [data]);

  const title = useMemo(() => {
    const parts = [t('common:nav.contracts')];

    if (query.type === 'inner') {
      parts.push(t('common:filters.inner'));
    } else if (query.company && companies[query.company]) {
      parts.push(companies[query.company]);
    }

    if (query.process && technicalProcesses[query.process]) {
      parts.push(technicalProcesses[query.process]);
    }

    return parts.join(' || ');
  }, [companies, query.company, query.process, query.type, t, technicalProcesses]);

  const updateParams = (mutate: (next: URLSearchParams) => void): void => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next);
  };

  const handleTypeChange = (type: DocumentTypeParam | undefined): void => {
    updateParams((next) => {
      next.delete('type');
      if (type) {
        next.set('type', type);
      }
    });
  };

  const handleInnerClick = (): void => {
    updateParams((next) => {
      if (query.type === 'inner') {
        next.delete('type');
      } else {
        next.delete('company');
        next.set('type', 'inner');
      }
    });
  };

  const handleProcessChange = (processId: number | undefined): void => {
    updateParams((next) => {
      if (processId === undefined) {
        next.delete('process');
      } else {
        next.set('process', String(processId));
      }
    });
  };

  const documentType: DocumentTypeParam | undefined =
    query.type === 'buy' || query.type === 'sel' ? query.type : undefined;

  const tableOptions: MRT_TableOptions<GetContractsDto> = {
    columns,
    data: withArchived ? data || [] : actualContracts,
    enableExpanding: true,
    getSubRows: (row) => row.children,
    enablePagination: false,
    enableBottomToolbar: false,
    initialState: {
      expanded: true,
    },
    displayColumnDefOptions: {
      'mrt-row-expand': {
        size: 32,
        minSize: 32,
        maxSize: 32,
        Cell: ({ row, table }) =>
          row.original.children && row.original.children.length > 0 ? (
            <MRT_ExpandButton row={row} table={table} />
          ) : null,
      },
    },
    mantineTableContainerProps: {
      style: {
        height: '93vh',
      },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      style: {
        opacity: row.original.isArchived ? 0.5 : 1,
      },
    }),
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
          <Group gap='xs' mb='sm' ml='xs'>
            {query.company !== undefined && (
              <TypeFilters type={documentType} onTypeChange={handleTypeChange} />
            )}
            <Button
              size='xs'
              variant={query.type === 'inner' ? 'filled' : 'light'}
              onClick={handleInnerClick}
            >
              {t('common:filters.inner')}
            </Button>
            <ProcessFilters
              processId={query.process}
              onProcessChange={handleProcessChange}
            />
          </Group>

          <HoldingTable
            tableOptions={tableOptions}
            title={title}
            toolBarControls={
              <Group gap='sm'>
                <Button
                  onClick={() => navigate(`${UrlConstants.CONTRACTS_URL}/new`)}
                >
                  {t('common:actions.create')}
                </Button>
                <Switch
                  checked={withArchived}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setWithArchived(event.currentTarget.checked)
                  }
                  label={t('tables:showArchived')}
                />
              </Group>
            }
          />
        </>
      )}
    </>
  );
}
