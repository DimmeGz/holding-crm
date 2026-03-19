import { DocumentLinkItem } from '../common/DocumentLinkItem';
import { DocumentPageItem } from '../common/DocumentPageItem';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useCommissionInvoice } from '@/hooks/documents/useCommissionInvoices';
import { useLibsStore } from '@/stores/useLibsStore';

export function CommissionInvoicePage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']),
    { id } = useParams<{ id: string }>(),
    {
      data: commissionInvoice,
      loading,
      error,
    } = useCommissionInvoice(Number(id)),
    getCompanyName: (id: number) => string = useLibsStore(
      s => s.getCompanyName,
    ),
    getCurrencyName: (id: number) => string = useLibsStore(
      s => s.getCurrencyName,
    );

  console.log('commissionInvoice', commissionInvoice);

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && commissionInvoice && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Grid gutter='xs' align='flex-start'>
              <Grid.Col span={12}>
                <Group justify='flex-start' wrap='nowrap' gap='2'>
                  {commissionInvoice.status ? (
                    <IconCircleFilled color='green' />
                  ) : (
                    <IconCircle color='grey' stroke={5} />
                  )}
                  <Text
                    size='lg'
                    fw={StylesConstants.HEAVY_FONT_WEIGHT}
                    ml='xs'
                  >
                    {t('documents:documents.commissionInvoice')}{' '}
                    {CommonConstants.NUMBER}
                    {commissionInvoice.id}
                  </Text>
                </Group>
              </Grid.Col>

              <Grid.Col span={4}>
                <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                  {t('documents:documents.createdAt')}:{' '}
                  {new Date(commissionInvoice.creationDate).toLocaleDateString(
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
                translationKey={{
                  primary: 'documents:documents.payer',
                }}
                baseValue={{
                  primary: getCompanyName(commissionInvoice.buyerId),
                }}
              />
              <DocumentPageItem
                gridSpan={6}
                translationKey={{
                  primary: 'documents:documents.recipient',
                }}
                baseValue={{
                  primary: getCompanyName(commissionInvoice.sellerId),
                }}
              />
            </Grid>
          </Card>

          <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
            <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
              {t('documents:documents.payDelivery')}
            </Text>
            <Grid gutter='md' align='flex-start'>
              <DocumentLinkItem
                gridSpan={6}
                translationKey='documents:documents.byInvoice'
                value={{
                  label: `${commissionInvoice.invoice.invoiceNumber}`,
                  uri: `${UrlConstants.INVOICES_URL}/${commissionInvoice.invoice.id}`,
                }}
              />
              <DocumentLinkItem
                gridSpan={6}
                translationKey='documents:documents.subordinateInvoices'
                value={commissionInvoice.invoice.children.map(child => ({
                  label: `${child.invoiceNumber}`,
                  uri: `${UrlConstants.INVOICES_URL}/${child.id}`,
                }))}
              />
              <DocumentPageItem
                gridSpan={4}
                translationKey={{
                  primary: 'tables:columns.amount',
                }}
                baseValue={{
                  primary: `${commissionInvoice.documentSum} ${getCurrencyName(commissionInvoice.currencyId)}`,
                }}
              />
            </Grid>
          </Card>
        </>
      )}
    </>
  );
}
