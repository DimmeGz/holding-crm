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
import { InvoiceProductLineEditor } from '@/components/documents/common/InvoiceProductLineEditor';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import {
  createEmptyInvoiceFormValues,
  formValuesToCreateByContractPayload,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  getDefaultEurCurrencyId,
  invoiceToFormValues,
  prefillFromContract,
  prefillFromOrders,
  prefillFromParentInvoice,
  validateInvoiceForm,
} from '@/helpers/invoices-form.helpers';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useInvoice } from '@/hooks/documents/useInvoices';
import { useOrders } from '@/hooks/documents/useOrders';
import { useMutation } from '@/hooks/useMutation';
import { CompaniesService } from '@/services/companies/companies.service';
import { ContractsService } from '@/services/documents/contracts.service';
import { InvoicesService } from '@/services/documents/invoices.service';
import { OrdersService } from '@/services/documents/orders.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { InvoiceFormValues } from '@/types/documents/invoices.types';

type InvoiceFormMode = 'create' | 'edit' | 'createByContract';

export function InvoiceFormPage({
  mode: modeProp,
}: {
  mode: 'create' | 'edit';
}): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const contractIdParam = searchParams.get('contractId');
  const byContract = searchParams.get('byContract') === '1';
  const orderIdsParam = searchParams.get('orderIds');
  const parentInvoiceIdParam = searchParams.get('invoiceId');

  const mode: InvoiceFormMode =
    modeProp === 'edit'
      ? 'edit'
      : byContract
        ? 'createByContract'
        : 'create';

  const invoiceId = mode === 'edit' ? Number(id) : undefined;
  const orderIds = useMemo(
    () =>
      orderIdsParam
        ? orderIdsParam
            .split(',')
            .map(Number)
            .filter(value => value > 0)
        : [],
    [orderIdsParam],
  );

  const {
    data: invoiceData,
    loading: invoiceLoading,
    error: invoiceError,
  } = useInvoice(invoiceId ?? 0, mode === 'edit');

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

  const form = useForm<InvoiceFormValues>({
    initialValues: createEmptyInvoiceFormValues(defaultCurrencyId),
    validate: {
      invoiceNumber: value => {
        if (!value?.trim()) {
          return t('documents:documents.invoiceNumberRequired');
        }

        if (value.trim().length > 15) {
          return t('documents:documents.invoiceNumberMaxLength');
        }

        return null;
      },
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
      expectedDate: value =>
        !value ? t('documents:documents.expectedDateRequired') : null,
    },
  });

  const [prefillDone, setPrefillDone] = useState(false);

  const ordersQuery = useMemo(
    () => ({
      status: false,
      hidden: false,
      ...(form.values.sellerId
        ? { sellerId: Number(form.values.sellerId) }
        : {}),
      ...(form.values.buyerId ? { buyerId: Number(form.values.buyerId) } : {}),
    }),
    [form.values.buyerId, form.values.sellerId],
  );

  const { data: ordersList } = useOrders(
    mode !== 'createByContract' ? ordersQuery : undefined,
  );

  const orderOptions = useMemo(() => {
    const fromList = (ordersList ?? []).map(order => ({
      value: String(order.id),
      label: order.orderNumber,
    }));

    const prefilledIds = form.values.invoiceLines
      .map(line => line.orderId)
      .filter((value): value is string => Boolean(value));

    const missing = prefilledIds
      .filter(orderId => !fromList.some(option => option.value === orderId))
      .map(orderId => ({ value: orderId, label: `#${orderId}` }));

    return [...fromList, ...missing];
  }, [form.values.invoiceLines, ordersList]);

  useEffect(() => {
    if (mode !== 'edit' || !invoiceData?.invoice) {
      return;
    }

    if (invoiceData.invoice.status) {
      showError(t('documents:documents.cannotEditClosedInvoice'));
      navigate(`${UrlConstants.INVOICES_URL}/${invoiceData.invoice.id}`);
      return;
    }

    form.setValues(invoiceToFormValues(invoiceData.invoice));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceData, mode, navigate, t]);

  useEffect(() => {
    if (mode === 'edit' || prefillDone) {
      return;
    }

    const loadPrefill = async (): Promise<void> => {
      try {
        if (mode === 'createByContract' && contractIdParam) {
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
        } else if (orderIds.length > 0) {
          const responses = await Promise.all(
            orderIds.map(orderId => OrdersService.getById(orderId)),
          );
          form.setValues(
            prefillFromOrders(
              responses.map(response => response.order),
              defaultCurrencyId,
            ),
          );
        } else if (parentInvoiceIdParam) {
          const parentData = await InvoicesService.getById(
            Number(parentInvoiceIdParam),
          );
          const prefilled = prefillFromParentInvoice(
            parentData.invoice,
            defaultCurrencyId,
          );

          if (!prefilled) {
            showError(t('documents:documents.cannotCreateChildInvoice'));
          } else {
            form.setValues(prefilled);
          }
        }
      } catch {
        showError(t('common:messages.error'));
      } finally {
        setPrefillDone(true);
      }
    };

    const needsPrefill =
      (mode === 'createByContract' && Boolean(contractIdParam)) ||
      orderIds.length > 0 ||
      Boolean(parentInvoiceIdParam);

    if (!needsPrefill) {
      setPrefillDone(true);
      return;
    }

    void loadPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contractIdParam,
    defaultCurrencyId,
    mode,
    orderIds,
    parentInvoiceIdParam,
    prefillDone,
    t,
  ]);

  const { loading: saving, mutateAsync: saveInvoice } = useMutation(
    async (values: InvoiceFormValues) => {
      const validationError = validateInvoiceForm(values, mode);

      if (validationError === 'invoiceNumberRequired') {
        throw new Error(t('documents:documents.invoiceNumberRequired'));
      }

      if (validationError === 'invoiceNumberMaxLength') {
        throw new Error(t('documents:documents.invoiceNumberMaxLength'));
      }

      if (validationError === 'productLines') {
        throw new Error(t('documents:documents.productLinesRequired'));
      }

      if (validationError === 'required') {
        throw new Error(t('common:messages.error'));
      }

      if (mode === 'createByContract') {
        return InvoicesService.createByContract(
          formValuesToCreateByContractPayload(values),
        );
      }

      if (mode === 'create') {
        return InvoicesService.create(formValuesToCreatePayload(values));
      }

      return InvoicesService.update(
        invoiceId!,
        formValuesToUpdatePayload(values),
      );
    },
    {
      onSuccess: result => {
        showSuccess(t('common:messages.saveSuccess'));
        navigate(`${UrlConstants.INVOICES_URL}/${result.id}`);
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

      void saveInvoice(form.values);
    },
    [form, saveInvoice],
  );

  const currencyLabel = form.values.currencyId
    ? getCurrencyName(Number(form.values.currencyId))
    : '';

  const needsPrefill =
    mode !== 'edit' &&
    ((mode === 'createByContract' && Boolean(contractIdParam)) ||
      orderIds.length > 0 ||
      Boolean(parentInvoiceIdParam));

  const isLoading =
    !isLibsLoaded ||
    (mode === 'edit' && invoiceLoading) ||
    (needsPrefill && !prefillDone);

  if (isLoading) {
    return <Spinner />;
  }

  if (mode === 'edit' && invoiceError) {
    return (
      <h3>
        {t('common:messages.error')} {invoiceError}
      </h3>
    );
  }

  const title =
    mode === 'edit'
      ? t('documents:documents.invoiceEdit')
      : t('documents:documents.invoiceCreate');

  return (
    <DocumentFormLayout
      title={title}
      loading={saving}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(
          mode === 'edit' && invoiceId
            ? `${UrlConstants.INVOICES_URL}/${invoiceId}`
            : UrlConstants.INVOICES_URL,
        )
      }
    >
      <Grid gutter='md'>
        <Grid.Col span={4}>
          <TextInput
            label={t('documents:documents.invoice')}
            required
            maxLength={15}
            {...form.getInputProps('invoiceNumber')}
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
          <DateInput
            label={t('documents:documents.reportPeriod')}
            valueFormat='MM.YYYY'
            clearable
            {...form.getInputProps('reportPeriod')}
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
          <NumberInput
            label={t('documents:documents.transportAmount')}
            min={0}
            decimalScale={2}
            {...form.getInputProps('transportAmount')}
          />
        </Grid.Col>

        <Grid.Col span={3}>
          <NumberInput
            label='PONZ'
            min={0}
            {...form.getInputProps('ponz')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <NumberInput
            label={t('documents:documents.grossWeight')}
            min={0}
            {...form.getInputProps('grossWeight')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Switch
            mt={30}
            label={t('documents:documents.ordersSeparation')}
            {...form.getInputProps('separation', { type: 'checkbox' })}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Switch
            mt={30}
            label={t('documents:documents.reportDuplicating')}
            {...form.getInputProps('reportDuplicating', { type: 'checkbox' })}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label={t('documents:documents.additionalInfo')}
            maxLength={200}
            {...form.getInputProps('contractInfo')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Textarea
            label={t('documents:documents.comment')}
            maxLength={200}
            {...form.getInputProps('comment')}
          />
        </Grid.Col>
      </Grid>

      <InvoiceProductLineEditor
        lines={form.values.invoiceLines}
        onChange={lines => form.setFieldValue('invoiceLines', lines)}
        currencyLabel={currencyLabel}
        showOrderColumn={mode !== 'createByContract'}
        orderOptions={orderOptions}
        orderReadOnly={orderIds.length > 0}
      />

      <DocumentServiceLineEditor
        lines={form.values.invoiceServiceLines}
        onChange={lines => form.setFieldValue('invoiceServiceLines', lines)}
        currencyLabel={currencyLabel}
      />
    </DocumentFormLayout>
  );
}

export function InvoiceCreatePage(): ReactNode {
  return <InvoiceFormPage mode='create' />;
}

export function InvoiceEditPage(): ReactNode {
  return <InvoiceFormPage mode='edit' />;
}
