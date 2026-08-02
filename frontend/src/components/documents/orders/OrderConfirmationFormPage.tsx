import {
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Grid,
  NumberInput,
  Select,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { DocumentFormLayout } from '@/components/documents/common/DocumentFormLayout';
import { OrderProductLineEditor } from '@/components/documents/common/OrderProductLineEditor';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import {
  confirmationToFormValues,
  createEmptyConfirmationFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  prefillConfirmationFromOrder,
  validateConfirmationForm,
} from '@/helpers/orders-confirmation-form.helpers';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useOrder } from '@/hooks/documents/useOrders';
import { useMutation } from '@/hooks/useMutation';
import { OrdersConfirmationService } from '@/services/documents/orders-confirmation.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { OrderConfirmationFormValues } from '@/types/documents/orders-confirmation.types';

type OrderConfirmationFormMode = 'create' | 'edit';

export function OrderConfirmationFormPage({
  mode,
}: {
  mode: OrderConfirmationFormMode;
}): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);

  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
  } = useOrder(orderId);
  const order = orderData?.order;

  const companies = useLibsStore(s => s.companies);
  const warehouses = useLibsStore(s => s.warehouses);
  const incoterms = useLibsStore(s => s.incoterms);
  const isLibsLoaded = useLibsStore(s => s.isLoaded);
  const getCompanyName = useLibsStore(s => s.getCompanyName);
  const getWarehouseName = useLibsStore(s => s.getWarehouseName);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);

  const warehouseOptions = useMemo(
    () => recordToSelectData(warehouses),
    [warehouses],
  );
  const companyOptions = useMemo(
    () => recordToSelectData(companies),
    [companies],
  );
  const incotermsOptions = useMemo(
    () => recordToSelectData(incoterms),
    [incoterms],
  );

  const form = useForm<OrderConfirmationFormValues>({
    initialValues: createEmptyConfirmationFormValues(),
    validate: {
      confirmationNumber: value => {
        if (!value.trim()) {
          return t('documents:documents.confirmationNumberRequired');
        }

        if (!/\d+$/.test(value.trim())) {
          return t('documents:documents.confirmationNumberDigits');
        }

        return null;
      },
      buyerWarehouseId: value =>
        !value ? t('documents:documents.warehouseRequired') : null,
      incotermsId: value =>
        !value ? t('documents:documents.incotermsRequired') : null,
      transportPlace: value =>
        !value.trim()
          ? t('documents:documents.transportPlaceRequired')
          : null,
      expectedDate: value =>
        !value ? t('documents:documents.expectedDateRequired') : null,
    },
  });

  useEffect(() => {
    if (!order) {
      return;
    }

    if (mode === 'create') {
      if (order.status) {
        showError(t('documents:documents.cannotCreateConfirmationClosedOrder'));
        navigate(`${UrlConstants.ORDERS_URL}/${order.id}`);
        return;
      }

      form.setValues(prefillConfirmationFromOrder(order));
      return;
    }

    if (!order.confirmation) {
      showError(t('common:messages.error'));
      navigate(`${UrlConstants.ORDERS_URL}/${order.id}`);
      return;
    }

    form.setValues(confirmationToFormValues(order.confirmation));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, mode, navigate, t]);

  const { loading: saving, mutateAsync: saveConfirmation } = useMutation(
    async (values: OrderConfirmationFormValues) => {
      if (!order) {
        throw new Error(t('common:messages.error'));
      }

      const validationError = validateConfirmationForm(values);

      if (validationError === 'confirmationNumber') {
        throw new Error(t('documents:documents.confirmationNumberDigits'));
      }

      if (validationError === 'expectedDate') {
        throw new Error(t('documents:documents.expectedDateRequired'));
      }

      if (validationError === 'productLines') {
        throw new Error(t('documents:documents.productLinesRequired'));
      }

      if (validationError === 'required') {
        throw new Error(t('common:messages.error'));
      }

      if (mode === 'create') {
        return OrdersConfirmationService.create(
          formValuesToCreatePayload(order, values),
        );
      }

      if (!order.confirmation?.id) {
        throw new Error(t('common:messages.error'));
      }

      return OrdersConfirmationService.update(
        order.confirmation.id,
        formValuesToUpdatePayload(values),
      );
    },
    {
      onSuccess: () => {
        showSuccess(t('common:messages.saveSuccess'));
        navigate(`${UrlConstants.ORDERS_URL}/${orderId}`);
      },
      onError: message => {
        showError(message);
      },
    },
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      const validation = form.validate();

      if (validation.hasErrors) {
        return;
      }

      void saveConfirmation(form.values);
    },
    [form, saveConfirmation],
  );

  const currencyLabel = order ? getCurrencyName(order.currencyId) : '';

  if (!isLibsLoaded || orderLoading) {
    return <Spinner />;
  }

  if (orderError || !order) {
    return (
      <h3>
        {t('common:messages.error')} {orderError}
      </h3>
    );
  }

  return (
    <DocumentFormLayout
      title={
        mode === 'create'
          ? t('documents:documents.confirmationCreate')
          : t('documents:documents.confirmationEdit')
      }
      loading={saving}
      onSubmit={handleSubmit}
      onCancel={() => navigate(`${UrlConstants.ORDERS_URL}/${orderId}`)}
    >
      <Grid gutter='md' mb='md'>
        <Grid.Col span={4}>
          <TextInput
            label={t('documents:documents.confirmationNumber')}
            required
            maxLength={15}
            {...form.getInputProps('confirmationNumber')}
          />
        </Grid.Col>
        <Grid.Col span={8}>
          <Text size='sm' mt={30}>
            {t('documents:documents.order')}: {order.orderNumber}
          </Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text size='sm' c='dimmed'>
            {t('documents:documents.seller')}
          </Text>
          <Text>{getCompanyName(order.sellerId)}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size='sm' c='dimmed'>
            {t('documents:documents.warehouse')}
          </Text>
          <Text>{getWarehouseName(order.sellerWarehouseId)}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text size='sm' c='dimmed'>
            {t('documents:documents.buyer')}
          </Text>
          <Text>{getCompanyName(order.buyerId)}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label={t('documents:documents.warehouse')}
            data={warehouseOptions}
            required
            searchable
            {...form.getInputProps('buyerWarehouseId')}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Select
            label={t('documents:documents.recipient')}
            data={companyOptions}
            clearable
            searchable
            value={form.values.recipientId}
            onChange={value => {
              form.setFieldValue('recipientId', value);
              if (!value) {
                form.setFieldValue('recipientWarehouseId', null);
              }
            }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label={t('documents:documents.warehouse')}
            data={warehouseOptions}
            clearable
            searchable
            disabled={!form.values.recipientId}
            {...form.getInputProps('recipientWarehouseId')}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <DateInput
            label={t('documents:documents.expectedDate')}
            valueFormat='DD.MM.YYYY'
            required
            {...form.getInputProps('expectedDate')}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            label={t('documents:documents.paymentDelay')}
            min={0}
            {...form.getInputProps('paymentDelay')}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Text size='sm' c='dimmed'>
            {t('documents:documents.currency')}
          </Text>
          <Text mt={8}>{getCurrencyName(order.currencyId)}</Text>
        </Grid.Col>

        <Grid.Col span={4}>
          <Select
            label={t('documents:documents.incoterms')}
            data={incotermsOptions}
            required
            searchable
            {...form.getInputProps('incotermsId')}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label={t('documents:documents.transportPlace')}
            required
            maxLength={20}
            {...form.getInputProps('transportPlace')}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label={t('documents:documents.comment')}
            maxLength={200}
            {...form.getInputProps('comment')}
          />
        </Grid.Col>
      </Grid>

      <OrderProductLineEditor
        lines={form.values.orderLines}
        onChange={lines => form.setFieldValue('orderLines', lines)}
        currencyLabel={currencyLabel}
        hideBatchRename
      />
    </DocumentFormLayout>
  );
}

export function OrderConfirmationCreatePage(): ReactNode {
  return <OrderConfirmationFormPage mode='create' />;
}

export function OrderConfirmationEditPage(): ReactNode {
  return <OrderConfirmationFormPage mode='edit' />;
}
