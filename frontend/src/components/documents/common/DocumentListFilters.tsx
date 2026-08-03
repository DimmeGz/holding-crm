import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, Select } from '@mantine/core';
import {
  getMaxQuarterForYear,
  getOrderYearsList,
  getQuarterYears,
  getQuartersForYear,
  type DocumentTypeParam,
  type OrderStatusUrl,
} from '@/helpers/documents-query.helpers';
import { useLibsStore } from '@/stores/useLibsStore';

type ProcessFiltersProps = {
  processId?: number;
  onProcessChange: (processId: number | undefined) => void;
};

export function ProcessFilters({
  processId,
  onProcessChange,
}: ProcessFiltersProps): ReactNode {
  const technicalProcesses = useLibsStore((s) => s.technicalProcesses);

  const processEntries = useMemo(
    () =>
      Object.entries(technicalProcesses)
        .map(([id, name]) => ({ id: Number(id), name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [technicalProcesses],
  );

  if (processEntries.length === 0) {
    return null;
  }

  return (
    <Group gap='xs'>
      {processEntries.map((process) => (
        <Button
          key={process.id}
          size='xs'
          variant={processId === process.id ? 'filled' : 'light'}
          onClick={() =>
            onProcessChange(processId === process.id ? undefined : process.id)
          }
        >
          {process.name}
        </Button>
      ))}
    </Group>
  );
}

type TypeFiltersProps = {
  type?: DocumentTypeParam;
  onTypeChange: (type: DocumentTypeParam | undefined) => void;
  /** document: buy=incoming; payment: sel=incoming */
  mode?: 'document' | 'payment';
};

export function TypeFilters({
  type,
  onTypeChange,
  mode = 'document',
}: TypeFiltersProps): ReactNode {
  const { t } = useTranslation(['common']);

  const incomingType: DocumentTypeParam = mode === 'payment' ? 'sel' : 'buy';
  const outgoingType: DocumentTypeParam = mode === 'payment' ? 'buy' : 'sel';

  return (
    <Group gap='xs'>
      <Button
        size='xs'
        variant={type === incomingType ? 'filled' : 'light'}
        onClick={() =>
          onTypeChange(type === incomingType ? undefined : incomingType)
        }
      >
        {t('common:filters.incoming')}
      </Button>
      <Button
        size='xs'
        variant={type === outgoingType ? 'filled' : 'light'}
        onClick={() =>
          onTypeChange(type === outgoingType ? undefined : outgoingType)
        }
      >
        {t('common:filters.outgoing')}
      </Button>
    </Group>
  );
}

type QuarterFiltersProps = {
  date?: string;
  onDateChange: (date: string) => void;
};

function parseDateParts(date?: string): {
  year?: number;
  quarter?: number;
  isOld: boolean;
} {
  if (!date || date === 'old') {
    return { isOld: date === 'old' };
  }

  const [yearRaw, quarterRaw] = date.split('-');
  const year = Number(yearRaw);
  const quarter = Number(quarterRaw);

  return {
    year: Number.isFinite(year) ? year : undefined,
    quarter: Number.isFinite(quarter) ? quarter : undefined,
    isOld: false,
  };
}

export function QuarterFilters({
  date,
  onDateChange,
}: QuarterFiltersProps): ReactNode {
  const { t } = useTranslation(['common']);
  const years = useMemo(() => getQuarterYears(), []);
  const { year: dateYear, quarter: dateQuarter, isOld } = parseDateParts(date);

  const [browsingYear, setBrowsingYear] = useState<number>(
    dateYear ?? years[0] ?? new Date().getFullYear(),
  );

  useEffect(() => {
    if (dateYear !== undefined) {
      setBrowsingYear(dateYear);
    }
  }, [dateYear]);

  const selectedYear = isOld ? browsingYear : (dateYear ?? browsingYear);
  const quarters = useMemo(
    () => getQuartersForYear(selectedYear),
    [selectedYear],
  );

  const handleYearChange = (value: string | null): void => {
    if (!value) {
      return;
    }

    const nextYear = Number(value);
    setBrowsingYear(nextYear);

    const preferredQuarter = dateQuarter ?? 1;
    const maxQuarter = getMaxQuarterForYear(nextYear);
    const nextQuarter = Math.min(preferredQuarter, maxQuarter);
    onDateChange(`${nextYear}-${nextQuarter}`);
  };

  return (
    <Group gap='xs' align='center'>
      <Select
        size='xs'
        w={96}
        allowDeselect={false}
        data={years.map(String)}
        value={String(selectedYear)}
        onChange={handleYearChange}
        aria-label={t('common:filters.year')}
      />
      {quarters.map((quarterValue) => {
        const quarterNum = quarterValue.split('-')[1];
        return (
          <Button
            key={quarterValue}
            size='xs'
            variant={!isOld && date === quarterValue ? 'filled' : 'light'}
            onClick={() => onDateChange(quarterValue)}
          >
            {t('common:filters.quarter', { n: quarterNum })}
          </Button>
        );
      })}
      <Button
        size='xs'
        variant={isOld ? 'filled' : 'light'}
        onClick={() => onDateChange('old')}
      >
        {t('common:filters.old')}
      </Button>
    </Group>
  );
}

type OrderStatusFiltersProps = {
  statusUrl: OrderStatusUrl;
  year?: number;
  onStatusChange: (statusUrl: OrderStatusUrl) => void;
  onYearChange: (year: number) => void;
};

export function OrderStatusFilters({
  statusUrl,
  year,
  onStatusChange,
  onYearChange,
}: OrderStatusFiltersProps): ReactNode {
  const { t } = useTranslation(['common']);
  const years = useMemo(() => getOrderYearsList(), []);

  return (
    <Group gap='xs'>
      <Button
        size='xs'
        variant={statusUrl === 'open' ? 'filled' : 'light'}
        onClick={() => onStatusChange('open')}
      >
        {t('common:filters.open')}
      </Button>
      <Button
        size='xs'
        variant={statusUrl === 'closed' ? 'filled' : 'light'}
        onClick={() => onStatusChange('closed')}
      >
        {t('common:filters.closed')}
        {statusUrl === 'closed' && year ? ` (${year})` : ''}
      </Button>
      <Button
        size='xs'
        variant={statusUrl === 'all' ? 'filled' : 'light'}
        onClick={() => onStatusChange('all')}
      >
        {t('common:filters.all')}
        {statusUrl === 'all' && year ? ` (${year})` : ''}
      </Button>
      {statusUrl !== 'open' &&
        years.map((y) => (
          <Button
            key={y}
            size='xs'
            variant={year === y ? 'filled' : 'light'}
            onClick={() => onYearChange(y)}
          >
            {y}
          </Button>
        ))}
    </Group>
  );
}
