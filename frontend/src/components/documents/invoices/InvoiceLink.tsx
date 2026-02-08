import type { ReactNode } from 'react';
import { Text } from '@mantine/core';
import { UrlConstants } from '@/constants/url-constants';

export function InvoiceLink({
  invoice,
}: {
  invoice: {
    id: number;
    invoiceNumber: string;
  };
}): ReactNode {
  return (
    <Text
      component='a'
      href={`${UrlConstants.INVOICES_URL}/${invoice.id}`}
      td='underline'
      style={{ cursor: 'pointer' }}
      key={invoice.id}
    >
      {invoice.invoiceNumber}
    </Text>
  );
}
