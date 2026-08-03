import { type ReactNode, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { recordToSelectData } from '@/helpers/select.helpers';
import {
  showError,
  showSuccess,
} from '@/helpers/notifications.helpers';
import { useBatchDetail } from '@/hooks/goods/useBatchDetail';
import { useMutation } from '@/hooks/useMutation';
import { BatchesService } from '@/services/goods/batches.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { UpdateBatchPayload } from '@/types/goods/batches.types';

type BatchUpdateFormValues = {
  countryOfOriginId: string | null;
  customFields: Record<string, string>;
};

export function BatchUpdatePage(): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const batchId = Number(id);
  const isValidBatchId = Number.isFinite(batchId) && batchId > 0;
  const invoiceId = Number(searchParams.get('invoiceId'));
  const countries = useLibsStore(s => s.countries);
  const upsertBatch = useLibsStore(s => s.upsertBatch);

  const { data, loading, error } = useBatchDetail(
    isValidBatchId ? batchId : 0,
  );
  const countryOptions = useMemo(
    () => recordToSelectData(countries),
    [countries],
  );

  const form = useForm<BatchUpdateFormValues>({
    initialValues: {
      countryOfOriginId: null,
      customFields: {},
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const customFields: Record<string, string> = {};
    for (const field of data.customFields) {
      customFields[String(field.id)] =
        field.value ?? field.defaultValue ?? '';
    }

    form.setValues({
      countryOfOriginId:
        data.countryOfOriginId != null
          ? String(data.countryOfOriginId)
          : null,
      customFields,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const { loading: saving, mutateAsync: runUpdate } = useMutation(
    (payload: UpdateBatchPayload) => BatchesService.update(batchId, payload),
    {
      onSuccess: result => {
        upsertBatch(result.id, {
          name: result.name,
          productId: result.productId,
        });
        showSuccess(t('common:messages.saveSuccess'));
        if (Number.isFinite(invoiceId) && invoiceId > 0) {
          navigate(`${UrlConstants.INVOICES_URL}/${invoiceId}`);
        } else {
          navigate(UrlConstants.BATCHES_URL);
        }
      },
      onError: message => showError(message),
    },
  );

  const handleSubmit = form.onSubmit(values => {
    if (!data) {
      return;
    }

    void runUpdate({
      countryOfOriginId: values.countryOfOriginId
        ? Number(values.countryOfOriginId)
        : null,
      customFields: data.customFields.map(field => ({
        customFieldId: field.id,
        value: values.customFields[String(field.id)] ?? '',
      })),
    });
  });

  const title = data
    ? `${t('documents:documents.batchUpdate')} ${data.name} || ${data.product.name}`
    : t('documents:documents.batchUpdate');

  if (!isValidBatchId) {
    return (
      <h3>
        {t('common:messages.error')} {t('common:messages.noData')}
      </h3>
    );
  }

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && data && (
        <Card shadow='sm' p='md' radius='md' withBorder maw={720} ml='xs' mt='xs'>
          <Text size='lg' fw={600} mb='md'>
            {title}
          </Text>

          <form onSubmit={handleSubmit}>
            <Stack gap='sm'>
              <TextInput
                label={t('tables:columns.product')}
                value={data.product.name}
                readOnly
              />
              <TextInput
                label={t('tables:columns.batch')}
                value={data.name}
                readOnly
              />
              <Select
                label={t('tables:columns.countryOfOrigin')}
                data={countryOptions}
                value={form.values.countryOfOriginId}
                onChange={value =>
                  form.setFieldValue('countryOfOriginId', value)
                }
                searchable
                clearable
                nothingFoundMessage={t('common:messages.noData')}
              />

              {data.customFields.map(field => {
                const labelParts = [field.name];
                if (field.description) {
                  labelParts.push(field.description);
                }
                if (field.unit) {
                  labelParts.push(`(${field.unit})`);
                }

                return (
                  <TextInput
                    key={field.id}
                    label={labelParts.join(' — ')}
                    description={
                      field.defaultValue
                        ? `${t('documents:documents.defaultValueHint')}: ${field.defaultValue}`
                        : undefined
                    }
                    value={form.values.customFields[String(field.id)] ?? ''}
                    onChange={event =>
                      form.setFieldValue('customFields', {
                        ...form.values.customFields,
                        [String(field.id)]: event.currentTarget.value,
                      })
                    }
                    maxLength={50}
                  />
                );
              })}

              <Group justify='flex-end' mt='sm'>
                <Button
                  variant='default'
                  type='button'
                  onClick={() => navigate(UrlConstants.BATCHES_URL)}
                  disabled={saving}
                >
                  {t('common:actions.cancel')}
                </Button>
                <Button type='submit' loading={saving}>
                  {t('common:actions.save')}
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>
      )}
    </>
  );
}
