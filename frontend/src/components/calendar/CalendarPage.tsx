import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import 'dayjs/locale/cs';
import 'dayjs/locale/uk';
import { MonthGrid } from '@/components/calendar/MonthGrid';
import { Spinner } from '@/components/shared/Spinner';
import { useCalendar } from '@/hooks/calendar/useCalendar';
import { useLibsStore } from '@/stores/useLibsStore';
import type { CalendarQuery } from '@/types/calendar/calendar.types';

function parsePositiveInt(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function dayjsLocale(language: string): string {
  return language.startsWith('cz') || language.startsWith('cs') ? 'cs' : 'uk';
}

export function CalendarPage(): ReactNode {
  const { t, i18n } = useTranslation(['common']);
  const [searchParams, setSearchParams] = useSearchParams();
  const technicalProcesses = useLibsStore((s) => s.technicalProcesses);
  const locale = dayjsLocale(i18n.language);

  const now = dayjs();
  const year =
    parsePositiveInt(searchParams.get('year')) ?? now.year();
  const month =
    parsePositiveInt(searchParams.get('month')) ?? now.month() + 1;

  const processIds = useMemo(() => {
    return searchParams
      .getAll('process')
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value > 0);
  }, [searchParams]);

  const typeParam = searchParams.get('type');
  const type =
    typeParam === 'sel' || typeParam === 'buy' ? typeParam : undefined;

  const query: CalendarQuery = useMemo(
    () => ({
      year,
      month,
      process: processIds.length ? processIds : undefined,
      type,
    }),
    [year, month, processIds, type],
  );

  const { data, loading, error } = useCalendar(query);

  const processEntries = useMemo(
    () =>
      Object.entries(technicalProcesses)
        .map(([id, name]) => ({ id: Number(id), name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [technicalProcesses],
  );

  const monthLabel = dayjs(`${year}-${String(month).padStart(2, '0')}-01`)
    .locale(locale)
    .format('MMMM YYYY');

  const updateParams = (mutate: (next: URLSearchParams) => void): void => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next);
  };

  const goToMonth = (offset: number): void => {
    const target = dayjs(
      `${year}-${String(month).padStart(2, '0')}-01`,
    ).add(offset, 'month');
    updateParams((next) => {
      next.set('year', String(target.year()));
      next.set('month', String(target.month() + 1));
    });
  };

  const toggleProcess = (processId: number): void => {
    updateParams((next) => {
      const current = next
        .getAll('process')
        .map(Number)
        .filter((value) => Number.isFinite(value) && value > 0);
      next.delete('process');
      const selected = current.includes(processId)
        ? current.filter((id) => id !== processId)
        : [...current, processId];
      for (const id of selected) {
        next.append('process', String(id));
      }
    });
  };

  const toggleType = (nextType: 'sel' | 'buy'): void => {
    updateParams((next) => {
      if (type === nextType) {
        next.delete('type');
      } else {
        next.set('type', nextType);
      }
    });
  };

  return (
    <Stack gap='md' p='md'>
      <Group justify='space-between' align='center'>
        <Title order={3}>{t('common:nav.calendar')}</Title>
        <Text fw={600} tt='capitalize'>
          {monthLabel}
        </Text>
        <Group gap='xs'>
          <Button variant='light' onClick={() => goToMonth(-1)}>
            {t('common:calendar.prevMonth')}
          </Button>
          <Button variant='light' onClick={() => goToMonth(1)}>
            {t('common:calendar.nextMonth')}
          </Button>
        </Group>
      </Group>

      <Group gap='xs'>
        {processEntries.map((process) => (
          <Button
            key={process.id}
            size='xs'
            variant={processIds.includes(process.id) ? 'filled' : 'light'}
            onClick={() => toggleProcess(process.id)}
          >
            {process.name}
          </Button>
        ))}
        <Button
          size='xs'
          variant={type === 'buy' ? 'filled' : 'light'}
          onClick={() => toggleType('buy')}
        >
          {t('common:calendar.incoming')}
        </Button>
        <Button
          size='xs'
          variant={type === 'sel' ? 'filled' : 'light'}
          onClick={() => toggleType('sel')}
        >
          {t('common:calendar.outgoing')}
        </Button>
      </Group>

      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && (
        <MonthGrid
          year={year}
          month={month}
          orders={data ?? []}
          locale={locale}
        />
      )}
    </Stack>
  );
}
