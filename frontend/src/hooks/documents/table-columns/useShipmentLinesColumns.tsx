import { useProductTableColumns } from './useProductTableColumns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef } from 'mantine-react-table';
import type { ShipmentLine } from '@/types/documents/shipments.types';
import type { UseProductTableColumns } from '@/types/documents/common-documents.types';

export function useShipmentLinesColumns(
  currency: string,
): MRT_ColumnDef<ShipmentLine>[] {
  const { t } = useTranslation(['tables']),
    commonColumns: UseProductTableColumns = useProductTableColumns(currency);

  return useMemo(
    () => [
      commonColumns.product<ShipmentLine>(),
      commonColumns.package<ShipmentLine>(),
      commonColumns.qty<ShipmentLine>(),
      commonColumns.price<ShipmentLine>(),
      commonColumns.amount<ShipmentLine>(),
    ],
    [t, commonColumns],
  );
}

