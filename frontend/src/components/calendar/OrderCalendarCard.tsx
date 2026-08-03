import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Box, Text, Tooltip } from '@mantine/core';
import { UrlConstants } from '@/constants/url-constants';
import type { CalendarOrder } from '@/types/calendar/calendar.types';

type OrderCalendarCardProps = {
  order: CalendarOrder;
};

export function OrderCalendarCard({
  order,
}: OrderCalendarCardProps): ReactNode {
  const markers = [order.status ? '✓' : '', order.hasInvoices ? '+' : '']
    .filter(Boolean)
    .join('');

  const card = (
    <Box
      component={Link}
      to={`${UrlConstants.ORDERS_URL}/${order.id}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        backgroundColor: order.calendarHex ?? undefined,
        borderRadius: 4,
        padding: '4px 6px',
        fontSize: 10,
        lineHeight: 1.25,
        border: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <Text size='xs' fw={600} style={{ fontSize: 10 }}>
        №{order.orderNumber}
        {markers ? ` ${markers}` : ''}
        {order.isAsap ? ' ASAP' : ''}
      </Text>
      <Text size='xs' style={{ fontSize: 10 }}>
        {order.seller.name} {'>'} {order.buyer.name}
      </Text>
      {order.productSummary ? (
        <Text size='xs' style={{ fontSize: 10 }}>
          {order.productSummary}
        </Text>
      ) : null}
    </Box>
  );

  if (!order.tooltipLines.length) {
    return card;
  }

  return (
    <Tooltip
      multiline
      maw={280}
      label={
        <Text size='xs' style={{ whiteSpace: 'pre-line' }}>
          {order.tooltipLines.join('\n')}
        </Text>
      }
      withArrow
      position='top-start'
    >
      <div>{card}</div>
    </Tooltip>
  );
}
