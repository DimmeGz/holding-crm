import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Grid, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { BatchedProductLineEditor } from '@/components/documents/common/BatchedProductLineEditor';
import { DocumentFormLayout } from '@/components/documents/common/DocumentFormLayout';
import { DocumentServiceLineEditor } from '@/components/documents/common/DocumentServiceLineEditor';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import {
  showError,
  showSuccess,
  showWarning,
} from '@/helpers/notifications.helpers';
import {
  createEmptyReceiveFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  getDefaultEurCurrencyId,
  prefillReceiveFromShipment,
  receiveToFormValues,
  validateReceiveForm,
} from '@/helpers/receives-form.helpers';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useReceive } from '@/hooks/documents/useReceives';
import { useShipments } from '@/hooks/documents/useShipments';
import { useMutation } from '@/hooks/useMutation';
import { ReceivesService } from '@/services/documents/receives.service';
import { ShipmentsService } from '@/services/documents/shipments.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { ReceiveFormValues } from '@/types/documents/receives.types';

export function ReceiveFormPage({
  mode,
}: {
  mode: 'create' | 'edit';
}): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const receiveId = mode === 'edit' ? Number(id) : undefined;
  const shipmentIdParam = searchParams.get('shipmentId');

  const {
    data: receive,
    loading: receiveLoading,
    error: receiveError,
  } = useReceive(receiveId ?? 0, mode === 'edit');

  const companies = useLibsStore(s => s.companies);
  const warehouses = useLibsStore(s => s.warehouses);
  const currencies = useLibsStore(s => s.currencies);
  const incoterms = useLibsStore(s => s.incoterms);
  const isLibsLoaded = useLibsStore(s => s.isLoaded);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);

  const companyOptions = useMemo(() => recordToSelectData(companies), [companies]);
  const warehouseOptions = useMemo(
    () => recordToSelectData(warehouses),
    [warehouses],
  );
  const currencyOptions = useMemo(
    () => recordToSelectData(currencies),
    [currencies],
  );
  const incotermsOptions = useMemo(
    () => recordToSelectData(incoterms),
    [incoterms],
  );
  const defaultCurrencyId = useMemo(
    () => getDefaultEurCurrencyId(currencies),
    [currencies],
  );

  const { data: shipmentsList } = useShipments();
  const shipmentOptions = useMemo(
    () =>
      (shipmentsList ?? []).map(shipment => ({
        value: String(shipment.id),
        label: `#${shipment.id}`,
      })),
    [shipmentsList],
  );

  const form = useForm<ReceiveFormValues>({
    initialValues: createEmptyReceiveFormValues(defaultCurrencyId),
    validate: {
      sellerId: value =>
        !value ? t('documents:documents.sellerRequired') : null,
      buyerId: value => (!value ? t('documents:documents.buyerRequired') : null),
      buyerWarehouseId: value =>
        !value ? t('documents:documents.warehouseRequired') : null,
      currencyId: value =>
        !value ? t('documents:documents.currencyRequired') : null,
      shipmentId: value =>
        !value ? t('documents:documents.shipmentRequired') : null,
      expectedDate: value =>
        !value ? t('documents:documents.expectedDateRequired') : null,
      incotermsId: value =>
        !value ? t('documents:documents.incotermsRequired') : null,
    },
  });

  const [prefillDone, setPrefillDone] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !receive) {
      return;
    }

    if (receive.status) {
      showError(t('documents:documents.cannotEditClosedReceive'));
      navigate(`${UrlConstants.RECEIVES_URL}/${receive.id}`);
      return;
    }

    form.setValues(receiveToFormValues(receive));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receive, mode, navigate, t]);

  useEffect(() => {
    if (mode === 'edit' || prefillDone) {
      return;
    }

    const loadPrefill = async (): Promise<void> => {
      try {
        if (shipmentIdParam) {
          const response = await ShipmentsService.getById(
            Number(shipmentIdParam),
          );
          const values = prefillReceiveFromShipment(
            response.shipment,
            defaultCurrencyId,
          );
          form.setValues(values);
          if (values.receiveLines.some(line => !line.batchId)) {
            showWarning(t('documents:documents.prefillMissingBatch'));
          }
        } else if (defaultCurrencyId) {
          form.setFieldValue('currencyId', String(defaultCurrencyId));
        }
      } catch {
        showError(t('common:messages.error'));
      } finally {
        setPrefillDone(true);
      }
    };

    void loadPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCurrencyId, mode, prefillDone, shipmentIdParam, t]);

  const { loading: saving, mutateAsync: saveReceive } = useMutation(
    async (values: ReceiveFormValues) => {
      const validationError = validateReceiveForm(values);

      if (validationError === 'productLines') {
        throw new Error(t('documents:documents.productLinesRequired'));
      }

      if (validationError === 'expectedDate') {
        throw new Error(t('documents:documents.expectedDateRequired'));
      }

      if (validationError === 'required' || validationError === 'serviceLines') {
        throw new Error(t('common:messages.error'));
      }

      if (mode === 'create') {
        return ReceivesService.create(formValuesToCreatePayload(values));
      }

      return ReceivesService.update(
        receiveId!,
        formValuesToUpdatePayload(values),
      );
    },
    {
      onSuccess: result => {
        showSuccess(t('common:messages.saveSuccess'));
        navigate(`${UrlConstants.RECEIVES_URL}/${result.id}`);
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
    void saveReceive(form.values);
  };

  const isLoading =
    !isLibsLoaded ||
    (mode === 'edit' && receiveLoading) ||
    (mode === 'create' && !prefillDone);

  if (isLoading) {
    return <Spinner />;
  }

  if (mode === 'edit' && receiveError) {
    return (
      <h3>
        {t('common:messages.error')} {receiveError}
      </h3>
    );
  }

  const currencyLabel = form.values.currencyId
    ? getCurrencyName(Number(form.values.currencyId))
    : '';

  return (
    <DocumentFormLayout
      title={
        mode === 'create'
          ? t('documents:documents.receiveCreate')
          : t('documents:documents.receiveEdit')
      }
      loading={saving}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(
          mode === 'edit' && receiveId
            ? `${UrlConstants.RECEIVES_URL}/${receiveId}`
            : UrlConstants.RECEIVES_URL,
        )
      }
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('documents:documents.seller')}
            data={companyOptions}
            searchable
            {...form.getInputProps('sellerId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('documents:documents.buyer')}
            data={companyOptions}
            searchable
            {...form.getInputProps('buyerId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('documents:documents.warehouse')}
            data={warehouseOptions}
            searchable
            {...form.getInputProps('buyerWarehouseId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('documents:documents.byShipment')}
            data={shipmentOptions}
            searchable
            {...form.getInputProps('shipmentId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Select
            label={t('documents:documents.currency')}
            data={currencyOptions}
            searchable
            {...form.getInputProps('currencyId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DateInput
            label={t('tables:columns.expectedDate')}
            valueFormat='DD.MM.YYYY'
            {...form.getInputProps('expectedDate')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Select
            label={t('documents:documents.incoterms')}
            data={incotermsOptions}
            searchable
            {...form.getInputProps('incotermsId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label={t('documents:documents.transportPlace')}
            maxLength={20}
            {...form.getInputProps('transportPlace')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('documents:documents.transportAmount')}
            min={0}
            decimalScale={2}
            {...form.getInputProps('transportAmount')}
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
        lines={form.values.receiveLines}
        onChange={receiveLines =>
          form.setFieldValue('receiveLines', receiveLines)
        }
        currencyLabel={currencyLabel}
        showPrice
      />

      <DocumentServiceLineEditor
        lines={form.values.receiveServiceLines}
        onChange={receiveServiceLines =>
          form.setFieldValue('receiveServiceLines', receiveServiceLines)
        }
        currencyLabel={currencyLabel}
      />
    </DocumentFormLayout>
  );
}

export function ReceiveCreatePage(): ReactNode {
  return <ReceiveFormPage mode='create' />;
}

export function ReceiveEditPage(): ReactNode {
  return <ReceiveFormPage mode='edit' />;
}
