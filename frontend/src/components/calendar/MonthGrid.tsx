import { useMemo, type ReactNode } from 'react';
import dayjs from 'dayjs';
import { Box, SimpleGrid, Stack, Text } from '@mantine/core';
import { OrderCalendarCard } from '@/components/calendar/OrderCalendarCard';
import type { CalendarOrder } from '@/types/calendar/calendar.types';

type MonthGridProps = {
  year: number;
  month: number;
  orders: CalendarOrder[];
  locale: string;
};

type DayCell = {
  key: string;
  day: number | null;
  dateKey: string | null;
  isToday: boolean;
  isWeekend: boolean;
  isPadding: boolean;
};

const TODAY_BG = '#B2D3C2';
const WEEKEND_BG = '#ECECEC';
const PADDING_BG = '#999DA0';

function buildDayCells(year: number, month: number): DayCell[] {
  const first = dayjs(`${year}-${String(month).padStart(2, '0')}-01`);
  // dayjs: 0=Sunday ... 6=Saturday; convert to Monday-first index
  const mondayIndex = (first.day() + 6) % 7;
  const daysInMonth = first.daysInMonth();
  const today = dayjs();
  const cells: DayCell[] = [];

  for (let i = 0; i < mondayIndex; i++) {
    cells.push({
      key: `pad-start-${i}`,
      day: null,
      dateKey: null,
      isToday: false,
      isWeekend: false,
      isPadding: true,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = first.date(day);
    const weekday = date.day(); // 0 Sun .. 6 Sat
    const isWeekend = weekday === 0 || weekday === 6;
    const dateKey = date.format('YYYY-MM-DD');
    cells.push({
      key: dateKey,
      day,
      dateKey,
      isToday: date.isSame(today, 'day'),
      isWeekend,
      isPadding: false,
    });
  }

  while (cells.length % 7 !== 0) {
    const i = cells.length;
    cells.push({
      key: `pad-end-${i}`,
      day: null,
      dateKey: null,
      isToday: false,
      isWeekend: false,
      isPadding: true,
    });
  }

  return cells;
}

export function MonthGrid({
  year,
  month,
  orders,
  locale,
}: MonthGridProps): ReactNode {
  const weekdayLabels = useMemo(() => {
    // Known Monday — labels Mon..Sun regardless of locale week start.
    const monday = dayjs('2026-08-03').locale(locale);
    return Array.from({ length: 7 }, (_, i) =>
      monday.add(i, 'day').format('dd'),
    );
  }, [locale]);

  const cells = useMemo(() => buildDayCells(year, month), [year, month]);

  const ordersByDate = useMemo(() => {
    const map = new Map<string, CalendarOrder[]>();
    for (const order of orders) {
      const list = map.get(order.displayDate) ?? [];
      list.push(order);
      map.set(order.displayDate, list);
    }
    return map;
  }, [orders]);

  return (
    <Stack gap='xs'>
      <SimpleGrid cols={7} spacing={4}>
        {weekdayLabels.map((label, index) => (
          <Text key={index} ta='center' size='sm' fw={600}>
            {label}
          </Text>
        ))}
      </SimpleGrid>

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: 4,
        }}
      >
        {cells.map((cell) => {
          const dayOrders = cell.dateKey
            ? (ordersByDate.get(cell.dateKey) ?? [])
            : [];

          let background = '#fff';
          if (cell.isPadding) {
            background = PADDING_BG;
          } else if (cell.isToday) {
            background = TODAY_BG;
          } else if (cell.isWeekend) {
            background = WEEKEND_BG;
          }

          return (
            <Box
              key={cell.key}
              style={{
                background,
                minHeight: 120,
                padding: cell.isPadding ? 0 : 8,
                border: '1px solid #dee2e6',
                verticalAlign: 'top',
                overflow: 'hidden',
              }}
            >
              {!cell.isPadding && (
                <Stack gap={4} style={{ height: '100%' }}>
                  <Text size='sm' fw={600}>
                    {cell.day}
                  </Text>
                  <Stack
                    gap={4}
                    style={{
                      maxHeight: 220,
                      overflowY: 'auto',
                    }}
                  >
                    {dayOrders.map((order) => (
                      <OrderCalendarCard key={order.id} order={order} />
                    ))}
                  </Stack>
                </Stack>
              )}
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}
