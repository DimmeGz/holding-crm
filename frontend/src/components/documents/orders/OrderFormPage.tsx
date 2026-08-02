import {
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Grid,
  NumberInput,
  Select,
  Switch,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { DocumentFormLayout } from '@/components/documents/common/DocumentFormLayout';
import { DocumentServiceLineEditor } from '@/components/documents/common/DocumentServiceLineEditor';
import { OrderProductLineEditor } from '@/components/documents/common/OrderProductLineEditor';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import {
  createEmptyOrderFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  getDefaultEurCurrencyId,
  orderToFormValues,
  prefillFromContract,
  validateOrderForm,
} from '@/helpers/orders-form.helpers';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useContracts } from '@/hooks/documents/useContracts';
import { useOrder } from '@/hooks/documents/useOrders';
import { useMutation } from '@/hooks/useMutation';
import { CompaniesService } from '@/services/companies/companies.service';
import { ContractsService } from '@/services/documents/contracts.service';
import { OrdersService } from '@/services/documents/orders.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { OrderFormValues } from '@/types/documents/orders.types';

type OrderFormMode = 'create' | 'edit';

export function OrderFormPage({ mode }: { mode: OrderFormMode }): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const contractIdParam = searchParams.get('contractId');
  const orderId = mode === 'edit' ? Number(id) : undefined;

  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
  } = useOrder(orderId ?? 0, mode === 'edit');
  const { data: contractsList, loading: contractsListLoading } = useContracts();

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
  const contractOptions = useMemo(() => {
    if (!contractsList) {
      return [];
    }

    return contractsList.flatMap(contract => [
      { value: String(contract.id), label: contract.name },
      ...(contract.children ?? []).map(child => ({
        value: String(child.id),
        label: `- ${child.name}`,
      })),
    ]);
  }, [contractsList]);

  const defaultCurrencyId = useMemo(
    () => getDefaultEurCurrencyId(currencies),
    [currencies],
  );

  const form = useForm<OrderFormValues>({
    initialValues: createEmptyOrderFormValues(defaultCurrencyId),
    validate: {
      contractId: value =>
        !value ? t('documents:documents.contractRequired') : null,
      sellerId: value =>
        !value ? t('documents:documents.sellerRequired') : null,
      sellerWarehouseId: value =>
        !value ? t('documents:documents.warehouseRequired') : null,
      buyerId: value => (!value ? t('documents:documents.buyerRequired') : null),
      buyerWarehouseId: value =>
        !value ? t('documents:documents.warehouseRequired') : null,
      currencyId: value =>
        !value ? t('documents:documents.currencyRequired') : null,
      incotermsId: value =>
        !value ? t('documents:documents.incotermsRequired') : null,
    },
  });

  const [contractPrefillDone, setContractPrefillDone] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !orderData?.order) {
      return;
    }

    if (orderData.order.status) {
      showError(t('documents:documents.cannotEditClosedOrder'));
      navigate(`${UrlConstants.ORDERS_URL}/${orderData.order.id}`);
      return;
    }

    form.setValues(orderToFormValues(orderData.order));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData, mode, navigate, t]);

  useEffect(() => {
    if (mode !== 'create' || !contractIdParam || contractPrefillDone) {
      return;
    }

    const loadContract = async (): Promise<void> => {
      try {
        const contractData = await ContractsService.getById(
          Number(contractIdParam),
        );
        const contract = contractData.contract;
        const [sellerCompany, buyerCompany] = await Promise.all([
          CompaniesService.getById(contract.sellerId),
          CompaniesService.getById(contract.buyerId),
        ]);

        form.setValues(
          prefillFromContract(
            contract,
            sellerCompany,
            buyerCompany,
            defaultCurrencyId,
          ),
        );
        setContractPrefillDone(true);
      } catch {
        showError(t('common:messages.error'));
        setContractPrefillDone(true);
      }
    };

    void loadContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractIdParam, contractPrefillDone, defaultCurrencyId, mode, t]);

  const { loading: saving, mutateAsync: saveOrder } = useMutation(
    async (values: OrderFormValues) => {
      const validationError = validateOrderForm(values);

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
        return OrdersService.create(formValuesToCreatePayload(values));
      }

      return OrdersService.update(
        orderId!,
        formValuesToUpdatePayload(values),
      );
    },
    {
      onSuccess: result => {
        showSuccess(t('common:messages.saveSuccess'));
        navigate(`${UrlConstants.ORDERS_URL}/${result.id}`);
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

      void saveOrder(form.values);
    },
    [form, saveOrder],
  );

  const currencyLabel = form.values.currencyId
    ? getCurrencyName(Number(form.values.currencyId))
    : '';

  const isLoading =
    !isLibsLoaded ||
    contractsListLoading ||
    (mode === 'edit' && orderLoading) ||
    (mode === 'create' && Boolean(contractIdParam) && !contractPrefillDone);

  if (isLoading) {
    return <Spinner />;
  }

  if (mode === 'edit' && orderError) {
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
          ? t('documents:documents.orderCreate')
          : t('documents:documents.orderEdit')
      }
      loading={saving}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(
          mode === 'edit' && orderId
            ? `${UrlConstants.ORDERS_URL}/${orderId}`
            : UrlConstants.ORDERS_URL,
        )
      }
    >
      <Grid gutter='md'>
        <Grid.Col span={4}>
          <TextInput
            label={t('documents:documents.orderNumber')}
            placeholder={
              mode === 'create'
                ? t('documents:documents.orderNumberAuto')
                : undefined
            }
            maxLength={15}
            {...form.getInputProps('orderNumber')}
          />
        </Grid.Col>
        <Grid.Col span={8}>
          <Select
            label={t('documents:documents.contract')}
            data={contractOptions}
            required
            searchable
            {...form.getInputProps('contractId')}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <DateInput
            label={t('tables:columns.signatureDate')}
            valueFormat='DD.MM.YYYY'
            {...form.getInputProps('signatureDate')}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <DateInput
            label={t('documents:documents.expectedDate')}
            valueFormat='DD.MM.YYYY'
            clearable
            disabled={form.values.isDateAsap}
            {...form.getInputProps('expectedDate')}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Switch
            mt={30}
            label={t('documents:documents.expectedDateAsap')}
            checked={form.values.isDateAsap}
            onChange={event => {
              const checked = event.currentTarget.checked;
              form.setFieldValue('isDateAsap', checked);
              if (checked) {
                form.setFieldValue('expectedDate', null);
              }
            }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label={t('documents:documents.seller')}
            data={companyOptions}
            required
            searchable
            {...form.getInputProps('sellerId')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label={t('documents:documents.warehouse')}
            data={warehouseOptions}
            required
            searchable
            {...form.getInputProps('sellerWarehouseId')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label={t('documents:documents.buyer')}
            data={companyOptions}
            required
            searchable
            {...form.getInputProps('buyerId')}
          />
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
        <Grid.Col span={3}>
          <Select
            label={t('documents:documents.currency')}
            data={currencyOptions}
            required
            searchable
            {...form.getInputProps('currencyId')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <NumberInput
            label={t('documents:documents.vat')}
            suffix=' %'
            min={0}
            {...form.getInputProps('vat')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <NumberInput
            label={t('documents:documents.paymentDelay')}
            min={0}
            {...form.getInputProps('paymentDelay')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
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
            maxLength={20}
            {...form.getInputProps('transportPlace')}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label={t('documents:documents.carPlate')}
            maxLength={30}
            {...form.getInputProps('carPlate')}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Switch
            mt={30}
            label={t('documents:documents.isHidden')}
            {...form.getInputProps('isHidden', { type: 'checkbox' })}
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
      />

      <DocumentServiceLineEditor
        lines={form.values.orderServiceLines}
        onChange={lines => form.setFieldValue('orderServiceLines', lines)}
        currencyLabel={currencyLabel}
      />
    </DocumentFormLayout>
  );
}

export function OrderCreatePage(): ReactNode {
  return <OrderFormPage mode='create' />;
}

export function OrderEditPage(): ReactNode {
  return <OrderFormPage mode='edit' />;
}
