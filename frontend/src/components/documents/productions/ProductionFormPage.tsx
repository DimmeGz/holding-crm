import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Select, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { BatchedProductLineEditor } from '@/components/documents/common/BatchedProductLineEditor';
import { DocumentFormLayout } from '@/components/documents/common/DocumentFormLayout';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import {
  createEmptyProductionFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  productionToFormValues,
  validateProductionForm,
} from '@/helpers/productions-form.helpers';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useProduction } from '@/hooks/documents/useProductions';
import { useMutation } from '@/hooks/useMutation';
import { ProductionsService } from '@/services/documents/productions.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { ProductionFormValues } from '@/types/documents/productions.types';

export function ProductionFormPage({
  mode,
}: {
  mode: 'create' | 'edit';
}): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productionId = mode === 'edit' ? Number(id) : undefined;

  const {
    data: production,
    loading: productionLoading,
    error: productionError,
  } = useProduction(productionId ?? 0, mode === 'edit');

  const companies = useLibsStore(s => s.companies);
  const warehouses = useLibsStore(s => s.warehouses);

  const companyOptions = useMemo(() => recordToSelectData(companies), [companies]);
  const warehouseOptions = useMemo(
    () => recordToSelectData(warehouses),
    [warehouses],
  );

  const form = useForm<ProductionFormValues>({
    initialValues: createEmptyProductionFormValues(),
    validate: {
      companyId: value =>
        !value ? t('documents:documents.companyRequired') : null,
      warehouseId: value =>
        !value ? t('documents:documents.warehouseRequired') : null,
    },
  });

  useEffect(() => {
    if (mode !== 'edit' || !production) {
      return;
    }

    if (production.status) {
      showError(t('documents:documents.cannotEditClosedProduction'));
      navigate(`${UrlConstants.PRODUCTION_URL}/${production.id}`);
      return;
    }

    form.setValues(productionToFormValues(production));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [production, mode, navigate, t]);

  const { loading: saving, mutateAsync: saveProduction } = useMutation(
    async (values: ProductionFormValues) => {
      const validationError = validateProductionForm(values);

      if (validationError === 'productionOutLines') {
        throw new Error(t('documents:documents.productionOutLinesRequired'));
      }

      if (validationError === 'productionInLines') {
        throw new Error(t('documents:documents.productionInLinesRequired'));
      }

      if (validationError === 'required') {
        throw new Error(t('common:messages.error'));
      }

      if (mode === 'create') {
        return ProductionsService.create(formValuesToCreatePayload(values));
      }

      return ProductionsService.update(
        productionId!,
        formValuesToUpdatePayload(values),
      );
    },
    {
      onSuccess: result => {
        showSuccess(t('common:messages.saveSuccess'));
        navigate(`${UrlConstants.PRODUCTION_URL}/${result.id}`);
      },
      onError: message => {
        showError(message);
      },
    },
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const result = form.validate();
    if (result.hasErrors) {
      return;
    }
    void saveProduction(form.values);
  };

  if (mode === 'edit' && productionLoading) {
    return <Spinner />;
  }

  if (mode === 'edit' && productionError) {
    return (
      <h3>
        {t('common:messages.error')} {productionError}
      </h3>
    );
  }

  return (
    <DocumentFormLayout
      title={
        mode === 'create'
          ? t('documents:documents.productionCreate')
          : t('documents:documents.productionEdit')
      }
      loading={saving}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(
          mode === 'edit' && productionId
            ? `${UrlConstants.PRODUCTION_URL}/${productionId}`
            : UrlConstants.PRODUCTION_URL,
        )
      }
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Select
            label={t('documents:documents.company')}
            data={companyOptions}
            searchable
            {...form.getInputProps('companyId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Select
            label={t('documents:documents.warehouse')}
            data={warehouseOptions}
            searchable
            {...form.getInputProps('warehouseId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DateInput
            label={t('tables:columns.expectedDate')}
            valueFormat='DD.MM.YYYY'
            {...form.getInputProps('expectedDate')}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label={t('documents:documents.comment')}
            minRows={2}
            {...form.getInputProps('comment')}
          />
        </Grid.Col>
      </Grid>

      <BatchedProductLineEditor
        lines={form.values.productionOutLines}
        onChange={productionOutLines =>
          form.setFieldValue('productionOutLines', productionOutLines)
        }
        title={t('documents:documents.productionOut')}
        priceColumnLabel={t('tables:columns.cost')}
        decimalScale={2}
        showPrice
      />

      <BatchedProductLineEditor
        lines={form.values.productionInLines}
        onChange={productionInLines =>
          form.setFieldValue('productionInLines', productionInLines)
        }
        title={t('documents:documents.productionIn')}
        showPrice={false}
      />
    </DocumentFormLayout>
  );
}

export function ProductionCreatePage(): ReactNode {
  return <ProductionFormPage mode='create' />;
}

export function ProductionEditPage(): ReactNode {
  return <ProductionFormPage mode='edit' />;
}
