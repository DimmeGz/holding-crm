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
import { DocumentServiceLineEditor } from '@/components/documents/common/DocumentServiceLineEditor';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { recordToSelectData } from '@/helpers/select.helpers';
import {
  createEmptyTransportFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  transportToFormValues,
  validateTransportForm,
} from '@/helpers/transports-form.helpers';
import { useTransport } from '@/hooks/documents/useTransports';
import { useMutation } from '@/hooks/useMutation';
import { TransportService } from '@/services/documents/transports.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { TransportFormValues } from '@/types/documents/transports.types';

export function TransportFormPage({
  mode,
}: {
  mode: 'create' | 'edit';
}): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const transportId = mode === 'edit' ? Number(id) : undefined;

  const {
    data: transport,
    loading: transportLoading,
    error: transportError,
  } = useTransport(transportId ?? 0, mode === 'edit');

  const companies = useLibsStore(s => s.companies);
  const warehouses = useLibsStore(s => s.warehouses);

  const companyOptions = useMemo(() => recordToSelectData(companies), [companies]);
  const warehouseOptions = useMemo(
    () => recordToSelectData(warehouses),
    [warehouses],
  );

  const form = useForm<TransportFormValues>({
    initialValues: createEmptyTransportFormValues(),
    validate: {
      companyId: value =>
        !value ? t('documents:documents.companyRequired') : null,
      warehouseSenderId: value =>
        !value ? t('documents:documents.warehouseRequired') : null,
      warehouseReceiveId: value =>
        !value ? t('documents:documents.warehouseRequired') : null,
    },
  });

  useEffect(() => {
    if (mode !== 'edit' || !transport) {
      return;
    }

    if (transport.status) {
      showError(t('documents:documents.cannotEditClosedTransport'));
      navigate(`${UrlConstants.TRANSPORT_URL}/${transport.id}`);
      return;
    }

    form.setValues(transportToFormValues(transport));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transport, mode, navigate, t]);

  const { loading: saving, mutateAsync: saveTransport } = useMutation(
    async (values: TransportFormValues) => {
      const validationError = validateTransportForm(values);

      if (validationError === 'productLines') {
        throw new Error(t('documents:documents.productLinesRequired'));
      }

      if (validationError === 'required' || validationError === 'serviceLines') {
        throw new Error(t('common:messages.error'));
      }

      if (mode === 'create') {
        return TransportService.create(formValuesToCreatePayload(values));
      }

      return TransportService.update(
        transportId!,
        formValuesToUpdatePayload(values),
      );
    },
    {
      onSuccess: result => {
        showSuccess(t('common:messages.saveSuccess'));
        navigate(`${UrlConstants.TRANSPORT_URL}/${result.id}`);
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
    void saveTransport(form.values);
  };

  if (mode === 'edit' && transportLoading) {
    return <Spinner />;
  }

  if (mode === 'edit' && transportError) {
    return (
      <h3>
        {t('common:messages.error')} {transportError}
      </h3>
    );
  }

  return (
    <DocumentFormLayout
      title={
        mode === 'create'
          ? t('documents:documents.transportCreate')
          : t('documents:documents.transportEdit')
      }
      loading={saving}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(
          mode === 'edit' && transportId
            ? `${UrlConstants.TRANSPORT_URL}/${transportId}`
            : UrlConstants.TRANSPORT_URL,
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
            label={t('documents:documents.warehouseSender')}
            data={warehouseOptions}
            searchable
            {...form.getInputProps('warehouseSenderId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Select
            label={t('documents:documents.warehouseReceive')}
            data={warehouseOptions}
            searchable
            {...form.getInputProps('warehouseReceiveId')}
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
        lines={form.values.productTransportLines}
        onChange={productTransportLines =>
          form.setFieldValue('productTransportLines', productTransportLines)
        }
        showPrice={false}
      />

      <DocumentServiceLineEditor
        lines={form.values.productTransportServiceLines}
        onChange={productTransportServiceLines =>
          form.setFieldValue(
            'productTransportServiceLines',
            productTransportServiceLines,
          )
        }
      />
    </DocumentFormLayout>
  );
}

export function TransportCreatePage(): ReactNode {
  return <TransportFormPage mode='create' />;
}

export function TransportEditPage(): ReactNode {
  return <TransportFormPage mode='edit' />;
}
