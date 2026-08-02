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
import { recordToSelectData } from '@/helpers/select.helpers';
import {
  createEmptyShipmentFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  getDefaultEurCurrencyId,
  prefillShipmentFromInvoice,
  shipmentToFormValues,
  validateShipmentForm,
} from '@/helpers/shipments-form.helpers';
import { useInvoices } from '@/hooks/documents/useInvoices';
import { useShipment } from '@/hooks/documents/useShipments';
import { useMutation } from '@/hooks/useMutation';
import { InvoicesService } from '@/services/documents/invoices.service';
import { ShipmentsService } from '@/services/documents/shipments.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { ShipmentFormValues } from '@/types/documents/shipments.types';

export function ShipmentFormPage({
  mode,
}: {
  mode: 'create' | 'edit';
}): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const shipmentId = mode === 'edit' ? Number(id) : undefined;
  const invoiceIdParam = searchParams.get('invoiceId');

  const {
    data: shipmentData,
    loading: shipmentLoading,
    error: shipmentError,
  } = useShipment(shipmentId ?? 0, mode === 'edit');

  const companies = useLibsStore(s => s.companies);
  const warehouses = useLibsStore(s => s.warehouses);
  const currencies = useLibsStore(s => s.currencies);
  const incoterms = useLibsStore(s => s.incoterms);
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

  const { data: invoicesList } = useInvoices();
  const invoiceOptions = useMemo(
    () =>
      (invoicesList ?? []).map(invoice => ({
        value: String(invoice.id),
        label: invoice.invoiceNumber,
      })),
    [invoicesList],
  );

  const form = useForm<ShipmentFormValues>({
    initialValues: createEmptyShipmentFormValues(defaultCurrencyId),
    validate: {
      sellerId: value =>
        !value ? t('documents:documents.sellerRequired') : null,
      sellerWarehouseId: value =>
        !value ? t('documents:documents.warehouseRequired') : null,
      buyerId: value => (!value ? t('documents:documents.buyerRequired') : null),
      currencyId: value =>
        !value ? t('documents:documents.currencyRequired') : null,
      invoiceId: value =>
        !value ? t('documents:documents.invoiceRequired') : null,
      expectedDate: value =>
        !value ? t('documents:documents.expectedDateRequired') : null,
      incotermsId: value =>
        !value ? t('documents:documents.incotermsRequired') : null,
    },
  });

  const [prefillDone, setPrefillDone] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !shipmentData?.shipment) {
      return;
    }

    if (shipmentData.shipment.status) {
      showError(t('documents:documents.cannotEditClosedShipment'));
      navigate(`${UrlConstants.SHIPMENTS_URL}/${shipmentData.shipment.id}`);
      return;
    }

    form.setValues(shipmentToFormValues(shipmentData.shipment));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentData, mode, navigate, t]);

  useEffect(() => {
    if (mode === 'edit' || prefillDone) {
      return;
    }

    const loadPrefill = async (): Promise<void> => {
      try {
        if (invoiceIdParam) {
          const response = await InvoicesService.getById(Number(invoiceIdParam));
          const values = prefillShipmentFromInvoice(
            response.invoice,
            defaultCurrencyId,
          );
          form.setValues(values);
          if (values.shipmentLines.some(line => !line.batchId)) {
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
  }, [defaultCurrencyId, invoiceIdParam, mode, prefillDone, t]);

  const { loading: saving, mutateAsync: saveShipment } = useMutation(
    async (values: ShipmentFormValues) => {
      const validationError = validateShipmentForm(values);

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
        return ShipmentsService.create(formValuesToCreatePayload(values));
      }

      return ShipmentsService.update(
        shipmentId!,
        formValuesToUpdatePayload(values),
      );
    },
    {
      onSuccess: result => {
        showSuccess(t('common:messages.saveSuccess'));
        navigate(`${UrlConstants.SHIPMENTS_URL}/${result.id}`);
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
    void saveShipment(form.values);
  };

  if (mode === 'edit' && shipmentLoading) {
    return <Spinner />;
  }

  if (mode === 'edit' && shipmentError) {
    return (
      <h3>
        {t('common:messages.error')} {shipmentError}
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
          ? t('documents:documents.shipmentCreate')
          : t('documents:documents.shipmentEdit')
      }
      loading={saving}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(
          mode === 'edit' && shipmentId
            ? `${UrlConstants.SHIPMENTS_URL}/${shipmentId}`
            : UrlConstants.SHIPMENTS_URL,
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
            label={t('documents:documents.warehouse')}
            data={warehouseOptions}
            searchable
            {...form.getInputProps('sellerWarehouseId')}
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
            label={t('documents:documents.byInvoice')}
            data={invoiceOptions}
            searchable
            {...form.getInputProps('invoiceId')}
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
        lines={form.values.shipmentLines}
        onChange={shipmentLines =>
          form.setFieldValue('shipmentLines', shipmentLines)
        }
        currencyLabel={currencyLabel}
        showPrice
      />

      <DocumentServiceLineEditor
        lines={form.values.shipmentServiceLines}
        onChange={shipmentServiceLines =>
          form.setFieldValue('shipmentServiceLines', shipmentServiceLines)
        }
        currencyLabel={currencyLabel}
      />
    </DocumentFormLayout>
  );
}

export function ShipmentCreatePage(): ReactNode {
  return <ShipmentFormPage mode='create' />;
}

export function ShipmentEditPage(): ReactNode {
  return <ShipmentFormPage mode='edit' />;
}
