import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { recordToSelectData } from '@/helpers/select.helpers';
import {
  showError,
  showSuccess,
} from '@/helpers/notifications.helpers';
import { useMutation } from '@/hooks/useMutation';
import { BatchesService } from '@/services/goods/batches.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type {
  BatchMutationResult,
  CreateBatchPayload,
  UpdateBatchPayload,
} from '@/types/goods/batches.types';

type BatchFormValues = {
  productId: string | null;
  name: string;
  countryOfOriginId: string | null;
};

function resolveProductCountry(
  productId: number | null | undefined,
  productCountries: Record<number, number | null>,
): string | null {
  if (productId == null) {
    return null;
  }
  const countryId = productCountries[productId];
  return countryId != null ? String(countryId) : null;
}

export function BatchFormModal({
  opened,
  mode,
  batchId = null,
  initialProductId = null,
  initialName = '',
  initialCountryOfOriginId = null,
  onClose,
  onSuccess,
}: {
  opened: boolean;
  mode: 'create' | 'edit';
  batchId?: number | null;
  initialProductId?: number | null;
  initialName?: string;
  initialCountryOfOriginId?: number | null;
  onClose: () => void;
  onSuccess: (batch: BatchMutationResult) => void;
}): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const products = useLibsStore(s => s.products);
  const productCountries = useLibsStore(s => s.productCountries);
  const countries = useLibsStore(s => s.countries);
  const upsertBatch = useLibsStore(s => s.upsertBatch);
  const [detailLoading, setDetailLoading] = useState(false);

  const productOptions = useMemo(
    () => recordToSelectData(products),
    [products],
  );
  const countryOptions = useMemo(
    () => recordToSelectData(countries),
    [countries],
  );

  const form = useForm<BatchFormValues>({
    initialValues: {
      productId: null,
      name: '',
      countryOfOriginId: null,
    },
    validate: {
      productId: value =>
        value ? null : t('documents:documents.batchProductRequired'),
      name: value =>
        value.trim() ? null : t('documents:documents.batchNameRequired'),
    },
  });

  useEffect(() => {
    if (!opened) {
      return;
    }

    const productCountry = resolveProductCountry(
      initialProductId,
      productCountries,
    );

    form.setValues({
      productId:
        initialProductId != null ? String(initialProductId) : null,
      name: initialName,
      countryOfOriginId:
        mode === 'create'
          ? initialCountryOfOriginId != null
            ? String(initialCountryOfOriginId)
            : productCountry
          : null,
    });
    form.clearErrors();

    if (mode !== 'edit' || !batchId) {
      return;
    }

    let cancelled = false;
    setDetailLoading(true);

    void BatchesService.getDetail(batchId)
      .then(detail => {
        if (cancelled) {
          return;
        }
        form.setValues({
          productId: String(detail.productId),
          name: detail.name,
          countryOfOriginId:
            detail.countryOfOriginId != null
              ? String(detail.countryOfOriginId)
              : null,
        });
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          showError(
            e instanceof Error ? e.message : t('common:messages.error'),
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDetailLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    opened,
    mode,
    batchId,
    initialProductId,
    initialName,
    initialCountryOfOriginId,
    productCountries,
  ]);

  const { loading, mutateAsync, error, reset } = useMutation(
    async (values: BatchFormValues) => {
      const productId = Number(values.productId);
      const countryOfOriginId = values.countryOfOriginId
        ? Number(values.countryOfOriginId)
        : null;

      if (mode === 'create') {
        const payload: CreateBatchPayload = {
          productId,
          name: values.name.trim(),
          countryOfOriginId,
        };
        return BatchesService.create(payload);
      }

      if (!batchId) {
        throw new Error('Batch id is required for edit');
      }

      const payload: UpdateBatchPayload = {
        productId,
        name: values.name.trim(),
        countryOfOriginId,
      };
      return BatchesService.update(batchId, payload);
    },
    {
      onSuccess: result => {
        upsertBatch(result.id, {
          name: result.name,
          productId: result.productId,
        });
        showSuccess(t('common:messages.saveSuccess'));
        onSuccess(result);
        onClose();
      },
      onError: message => showError(message),
    },
  );

  const handleClose = (): void => {
    if (loading || detailLoading) {
      return;
    }
    reset();
    onClose();
  };

  const handleProductChange = (value: string | null): void => {
    form.setFieldValue('productId', value);
    if (mode === 'create') {
      form.setFieldValue(
        'countryOfOriginId',
        resolveProductCountry(
          value ? Number(value) : null,
          productCountries,
        ),
      );
    }
  };

  const handleSubmit = form.onSubmit(values => {
    void mutateAsync(values);
  });

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        mode === 'create'
          ? t('documents:documents.batchCreate')
          : t('documents:documents.batchEditModal')
      }
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap='sm'>
          <Select
            label={t('tables:columns.product')}
            data={productOptions}
            value={form.values.productId}
            onChange={handleProductChange}
            searchable
            nothingFoundMessage={t('common:messages.noData')}
            error={form.errors.productId}
            disabled={detailLoading}
          />
          <TextInput
            label={t('tables:columns.batch')}
            value={form.values.name}
            onChange={event =>
              form.setFieldValue('name', event.currentTarget.value)
            }
            maxLength={16}
            error={form.errors.name}
            disabled={detailLoading}
          />
          <Select
            label={t('tables:columns.countryOfOrigin')}
            data={countryOptions}
            value={form.values.countryOfOriginId}
            onChange={value => form.setFieldValue('countryOfOriginId', value)}
            searchable
            clearable
            nothingFoundMessage={t('common:messages.noData')}
            disabled={detailLoading}
          />

          {error && (
            <Text size='sm' c='red'>
              {error}
            </Text>
          )}

          <Group justify='flex-end' mt='xs'>
            <Button
              variant='default'
              type='button'
              onClick={handleClose}
              disabled={loading || detailLoading}
            >
              {t('common:actions.cancel')}
            </Button>
            <Button type='submit' loading={loading || detailLoading}>
              {t('common:actions.save')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
