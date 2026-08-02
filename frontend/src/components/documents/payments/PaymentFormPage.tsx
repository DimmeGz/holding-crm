import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Grid, Select, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { DocumentFormLayout } from '@/components/documents/common/DocumentFormLayout';
import { PaymentLineEditor } from '@/components/documents/common/PaymentLineEditor';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import {
  createEmptyPaymentFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  getDefaultEurCurrencyId,
  paymentToFormValues,
  prefillFromInvoices,
  validatePaymentForm,
} from '@/helpers/payments-form.helpers';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useInvoices } from '@/hooks/documents/useInvoices';
import { usePayment } from '@/hooks/documents/usePayments';
import { useMutation } from '@/hooks/useMutation';
import { InvoicesService } from '@/services/documents/invoices.service';
import { PaymentsService } from '@/services/documents/payments.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { PaymentFormValues } from '@/types/documents/payments.types';

export function PaymentFormPage({
  mode,
}: {
  mode: 'create' | 'edit';
}): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const paymentId = mode === 'edit' ? Number(id) : undefined;

  const invoiceIds = useMemo(
    () =>
      (searchParams.get('invoiceIds') ?? '')
        .split(',')
        .map(Number)
        .filter(value => value > 0),
    [searchParams],
  );

  const {
    data: paymentData,
    loading: paymentLoading,
    error: paymentError,
  } = usePayment(paymentId ?? 0, mode === 'edit');

  const companies = useLibsStore(s => s.companies);
  const currencies = useLibsStore(s => s.currencies);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);

  const companyOptions = useMemo(() => recordToSelectData(companies), [companies]);
  const currencyOptions = useMemo(
    () => recordToSelectData(currencies),
    [currencies],
  );
  const defaultCurrencyId = useMemo(
    () => getDefaultEurCurrencyId(currencies),
    [currencies],
  );

  const form = useForm<PaymentFormValues>({
    initialValues: createEmptyPaymentFormValues(defaultCurrencyId),
    validate: {
      sellerId: value =>
        !value ? t('documents:documents.sellerRequired') : null,
      buyerId: value => (!value ? t('documents:documents.buyerRequired') : null),
      currencyId: value =>
        !value ? t('documents:documents.currencyRequired') : null,
      expectedDate: value =>
        !value ? t('documents:documents.expectedDateRequired') : null,
    },
  });

  const [prefillDone, setPrefillDone] = useState(false);
  const { data: invoicesList } = useInvoices();

  const invoiceOptions = useMemo(() => {
    const sellerId = form.values.sellerId
      ? Number(form.values.sellerId)
      : null;
    const buyerId = form.values.buyerId ? Number(form.values.buyerId) : null;
    const currencyId = form.values.currencyId
      ? Number(form.values.currencyId)
      : null;

    const fromList = (invoicesList ?? [])
      .filter(invoice => {
        if (sellerId && invoice.sellerId !== sellerId) return false;
        if (buyerId && invoice.buyerId !== buyerId) return false;
        if (currencyId && invoice.currencyId !== currencyId) return false;
        return true;
      })
      .map(invoice => ({
        value: String(invoice.id),
        label: invoice.invoiceNumber,
      }));

    const selectedIds = form.values.paymentLines
      .map(line => line.invoiceId)
      .filter((value): value is string => Boolean(value));

    const missing = selectedIds
      .filter(invoiceId => !fromList.some(option => option.value === invoiceId))
      .map(invoiceId => ({ value: invoiceId, label: `#${invoiceId}` }));

    return [...fromList, ...missing];
  }, [
    form.values.buyerId,
    form.values.currencyId,
    form.values.paymentLines,
    form.values.sellerId,
    invoicesList,
  ]);

  useEffect(() => {
    if (mode !== 'edit' || !paymentData?.payment) {
      return;
    }

    if (paymentData.payment.status) {
      showError(t('documents:documents.cannotEditClosedPayment'));
      navigate(`${UrlConstants.PAYMENTS_URL}/${paymentData.payment.id}`);
      return;
    }

    form.setValues(paymentToFormValues(paymentData.payment));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentData, mode, navigate, t]);

  useEffect(() => {
    if (mode === 'edit' || prefillDone) {
      return;
    }

    const loadPrefill = async (): Promise<void> => {
      try {
        if (invoiceIds.length > 0) {
          const responses = await Promise.all(
            invoiceIds.map(invoiceId => InvoicesService.getById(invoiceId)),
          );
          form.setValues(
            prefillFromInvoices(
              responses.map(response => response.invoice),
              defaultCurrencyId,
            ),
          );
        }
      } catch {
        showError(t('common:messages.error'));
      } finally {
        setPrefillDone(true);
      }
    };

    if (!invoiceIds.length) {
      setPrefillDone(true);
      return;
    }

    void loadPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCurrencyId, invoiceIds, mode, prefillDone, t]);

  const { loading: saving, mutateAsync: savePayment } = useMutation(
    async (values: PaymentFormValues) => {
      const validationError = validatePaymentForm(values);

      if (validationError === 'paymentLines') {
        throw new Error(t('documents:documents.paymentLinesRequired'));
      }

      if (validationError === 'expectedDate') {
        throw new Error(t('documents:documents.expectedDateRequired'));
      }

      if (validationError === 'required') {
        throw new Error(t('common:messages.error'));
      }

      if (mode === 'create') {
        return PaymentsService.create(formValuesToCreatePayload(values));
      }

      return PaymentsService.update(
        paymentId!,
        formValuesToUpdatePayload(values),
      );
    },
    {
      onSuccess: result => {
        showSuccess(t('common:messages.saveSuccess'));
        navigate(`${UrlConstants.PAYMENTS_URL}/${result.id}`);
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
    void savePayment(form.values);
  };

  if (mode === 'edit' && paymentLoading) {
    return <Spinner />;
  }

  if (mode === 'edit' && paymentError) {
    return (
      <h3>
        {t('common:messages.error')} {paymentError}
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
          ? t('documents:documents.paymentCreate')
          : t('documents:documents.paymentEdit')
      }
      loading={saving}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(
          mode === 'edit' && paymentId
            ? `${UrlConstants.PAYMENTS_URL}/${paymentId}`
            : UrlConstants.PAYMENTS_URL,
        )
      }
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('documents:documents.recipient')}
            data={companyOptions}
            searchable
            {...form.getInputProps('sellerId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('documents:documents.payer')}
            data={companyOptions}
            searchable
            {...form.getInputProps('buyerId')}
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
            label={t('tables:columns.paymentDate')}
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

      <PaymentLineEditor
        lines={form.values.paymentLines}
        onChange={paymentLines => form.setFieldValue('paymentLines', paymentLines)}
        invoiceOptions={invoiceOptions}
        currencyLabel={currencyLabel}
      />
    </DocumentFormLayout>
  );
}

export function PaymentCreatePage(): ReactNode {
  return <PaymentFormPage mode='create' />;
}

export function PaymentEditPage(): ReactNode {
  return <PaymentFormPage mode='edit' />;
}
