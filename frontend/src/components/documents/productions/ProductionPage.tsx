import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';

import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { DocumentPageItem } from '@/components/documents/common/DocumentPageItem';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';

import { useProduction } from '@/hooks/documents/useProductions';
import { useProductionInLinesColumns } from '@/hooks/documents/table-columns/useProductionInLinesColumns';
import { useProductionOutLinesColumns } from '@/hooks/documents/table-columns/useProductionOutLinesColumns';
import type {
  ProductionInLine,
  ProductionOutLine,
  Production,
} from '@/types/documents/productions.types';

export function ProductionPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']),
    { id } = useParams<{ id: string }>(),
    {
      data,
      loading,
      error,
    } = useProduction(Number(id)),
    production: Production | undefined = data ?? undefined,
    outColumns: MRT_ColumnDef<ProductionOutLine>[] =
      useProductionOutLinesColumns(),
    inColumns: MRT_ColumnDef<ProductionInLine>[] =
      useProductionInLinesColumns(),
    outLinesTableConfig: MRT_TableOptions<ProductionOutLine> = useMemo(
      () => ({
        data: production?.productionOutLines || [],
        columns: outColumns,
        enablePagination: false,
        enableSorting: false,
        enableColumnFilters: false,
        enableBottomToolbar: false,
        enableColumnActions: false,
        enableGlobalFilter: false,
        enableFullScreenToggle: false,
        enableHiding: false,
        mantinePaperProps: {
          shadow: 'sm',
          radius: 'md',
        },
      }),
      [production, outColumns],
    ),
    inLinesTableConfig: MRT_TableOptions<ProductionInLine> = useMemo(
      () => ({
        data: production?.productionInLines || [],
        columns: inColumns,
        enablePagination: false,
        enableSorting: false,
        enableColumnFilters: false,
        enableBottomToolbar: false,
        enableColumnActions: false,
        enableGlobalFilter: false,
        enableFullScreenToggle: false,
        enableHiding: false,
        mantinePaperProps: {
          shadow: 'sm',
          radius: 'md',
          mt: 'sm'
        },
      }),
      [production, inColumns],
    );

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && production && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Grid gutter='xs' align='flex-start'>
              <Grid.Col span={12}>
                <Group justify='flex-start' wrap='nowrap' gap='2'>
                  {production.status ? (
                    <IconCircleFilled color='green' />
                  ) : (
                    <IconCircle color='grey' stroke={5} />
                  )}
                  <Text
                    size='lg'
                    fw={StylesConstants.HEAVY_FONT_WEIGHT}
                    ml='xs'
                  >
                    {t('common:nav.production')}{' '}
                    {CommonConstants.NUMBER}
                    {production.id}
                  </Text>
                </Group>
              </Grid.Col>

              <Grid.Col span={12}>
                <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                  {t('tables:columns.expectedDate')}:{' '}
                  {new Date(production.expectedDate).toLocaleDateString(
                    'uk-UA',
                  )}
                </Text>
              </Grid.Col>
            </Grid>
          </Card>

          <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
            <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
              {t('documents:documents.mainInfo')}
            </Text>
            <Grid gutter='md' align='flex-start'>
              <DocumentPageItem
                gridSpan={6}
                translationKey={{ primary: 'documents:documents.company' }}
                baseValue={{ primary: production.company?.name }}
              />
              <DocumentPageItem
                gridSpan={6}
                translationKey={{ primary: 'documents:documents.warehouse' }}
                baseValue={{ primary: production.warehouse?.name }}
              />
            </Grid>
          </Card>

          {production.productionOutLines?.length > 0 && (
            <HoldingTable
              tableOptions={outLinesTableConfig}
              title={t('documents:documents.productionOut')}
            />
          )}

          {production.productionInLines?.length > 0 && (
            <HoldingTable
              tableOptions={inLinesTableConfig}
              title={t('documents:documents.productionIn')}
            />
          )}
        </>
      )}
    </>
  );
}
