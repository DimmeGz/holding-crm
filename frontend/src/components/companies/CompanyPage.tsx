import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Grid, Group, Table, Text, Title } from '@mantine/core';
import { CompanyInvoiceSection } from '@/components/companies/CompanyInvoiceSection';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useCompany } from '@/hooks/companies/useCompany';

export function CompanyPage(): ReactNode {
  const { t } = useTranslation(['common', 'companies']);
  const { id } = useParams<{ id: string }>();
  const companyId = Number(id);
  const { data, loading, error } = useCompany(companyId);

  const accounts = useMemo(() => data?.accounts ?? [], [data]);
  const waitingInvoices = useMemo(
    () => data?.outcomeInvoices ?? [],
    [data],
  );
  const debtInvoices = useMemo(() => data?.incomeInvoices ?? [], [data]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <h3>
        {t('common:messages.error')} {error}
      </h3>
    );
  }

  if (!data) {
    return <h3>{t('common:messages.noData')}</h3>;
  }

  return (
    <Card shadow='sm' radius='md' p='md'>
      <Group justify='space-between' mb='md'>
        <div>
          <Text
            component={Link}
            to={UrlConstants.COMPANIES_URL}
            size='sm'
            c='dimmed'
            td='underline'
          >
            {t('companies:title')}
          </Text>
          <Title order={3}>{data.name}</Title>
        </div>
        <Group gap='xs'>
          <Button
            component={Link}
            to={`${UrlConstants.MONTH_REPORT_URL}/${companyId}`}
            variant='light'
          >
            {t('companies:monthReport')}
          </Button>
          <Button
            component={Link}
            to={`${UrlConstants.YEAR_REPORT_URL}/${companyId}`}
            variant='light'
          >
            {t('companies:yearReport')}
          </Button>
          <Button
            component={Link}
            to={`${UrlConstants.PRODUCTION_REPORT_URL}/${companyId}`}
            variant='light'
          >
            {t('companies:productionReport')}
          </Button>
        </Group>
      </Group>

      <Grid mb='md'>
        <Grid.Col span={6}>
          <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
            {t('companies:defaultWarehouse')}:
          </Text>
          <Text size='sm' fw={StylesConstants.HEAVY_FONT_WEIGHT}>
            {data.defaultWarehouse?.name ?? CommonConstants.EMPTY_STRING}
          </Text>
        </Grid.Col>
      </Grid>

      <Title order={4} mb='xs'>
        {t('companies:balances')}
      </Title>
      <Table withTableBorder withColumnBorders mb='md'>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('companies:currency')}</Table.Th>
            <Table.Th>{t('companies:balance')}</Table.Th>
            <Table.Th>{t('companies:wait')}</Table.Th>
            <Table.Th>{t('companies:debtAmount')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {accounts.map((account) => (
            <Table.Tr key={account.id}>
              <Table.Td>{account.currency?.name}</Table.Td>
              <Table.Td>{account.balance}</Table.Td>
              <Table.Td>{account.wait}</Table.Td>
              <Table.Td>{account.debt}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <CompanyInvoiceSection
        title={t('companies:waiting')}
        side='waiting'
        invoices={waitingInvoices}
      />
      <CompanyInvoiceSection
        title={t('companies:debt')}
        side='debt'
        invoices={debtInvoices}
      />
    </Card>
  );
}
