import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Group, Table, Text } from '@mantine/core';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { useBatchesList } from '@/hooks/goods/useBatchesList';
import { useLibsStore } from '@/stores/useLibsStore';

function parseOptionalId(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function BatchesListPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const [searchParams, setSearchParams] = useSearchParams();
  const technicalProcesses = useLibsStore(s => s.technicalProcesses);

  const query = useMemo(
    () => ({
      process: parseOptionalId(searchParams.get('process')),
    }),
    [searchParams],
  );

  const { data, loading, error } = useBatchesList(query);

  const processEntries = useMemo(
    () =>
      Object.entries(technicalProcesses)
        .map(([id, name]) => ({
          id: Number(id),
          name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [technicalProcesses],
  );

  const title = useMemo(() => {
    const parts = [t('documents:documents.batchesList')];
    if (query.process && technicalProcesses[query.process]) {
      parts.push(technicalProcesses[query.process]);
    }
    return parts.join(' || ');
  }, [query.process, t, technicalProcesses]);

  const handleProcessClick = (processId: number): void => {
    const next = new URLSearchParams(searchParams);
    if (query.process === processId) {
      next.delete('process');
    } else {
      next.set('process', String(processId));
    }
    setSearchParams(next);
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
          <Text size='lg' fw={600} mb='sm' ml='xs'>
            {title}
          </Text>

          {processEntries.length > 0 && (
            <Group gap='xs' mb='sm' ml='xs'>
              {processEntries.map(process => (
                <Button
                  key={process.id}
                  size='xs'
                  variant={query.process === process.id ? 'filled' : 'light'}
                  onClick={() => handleProcessClick(process.id)}
                >
                  {process.name}
                </Button>
              ))}
            </Group>
          )}

          {(data?.length ?? 0) === 0 ? (
            <Text ml='xs' c='dimmed'>
              {t('common:messages.noData')}
            </Text>
          ) : (
            <Table
              striped
              highlightOnHover
              withTableBorder
              maw={800}
              ml='xs'
            >
              <Table.Tbody>
                {data?.map(group =>
                  group.batches.map((batch, index) => (
                    <Table.Tr key={batch.id}>
                      {index === 0 && (
                        <Table.Td rowSpan={group.batches.length} w='40%'>
                          {group.product.name}
                        </Table.Td>
                      )}
                      <Table.Td w={40} ta='center'>
                        {batch.hasCustomFields ? '+' : '-'}
                      </Table.Td>
                      <Table.Td>
                        <Text
                          component={Link}
                          to={`${UrlConstants.BATCHES_URL}/${batch.id}/edit`}
                          td='underline'
                          c='inherit'
                        >
                          {batch.name}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )),
                )}
              </Table.Tbody>
            </Table>
          )}
        </>
      )}
    </>
  );
}
