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
import { CommissionPaymentLineEditor } from '@/components/documents/common/CommissionPaymentLineEditor';
import { DocumentFormLayout } from '@/components/documents/common/DocumentFormLayout';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import {
  commissionPaymentToFormValues,
  createEmptyCommissionPaymentFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  getDefaultEurCurrencyId,
  prefillFromCommissionInvoices,
  validateCommissionPaymentForm,
} from '@/helpers/commission-payments-form.helpers';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useCommissionInvoices } from '@/hooks/documents/useCommissionInvoices';
import { useCommissionPayment } from '@/hooks/documents/useCommissionPayments';
import { useMutation } from '@/hooks/useMutation';
import { CommissionInvoicesService } from '@/services/documents/commission-invoices.service';
import { CommissionPaymentsService } from '@/services/documents/commission-payments.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { CommissionPaymentFormValues } from '@/types/documents/commission-payments.types';

export function CommissionPaymentFormPage({
  mode,
}: {
  mode: 'create' | 'edit';
}): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const commissionPaymentId = mode === 'edit' ? Number(id) : undefined;

  const commissionInvoiceIds = useMemo(
    () =>
      (searchParams.get('commissionInvoiceIds') ?? '')
        .split(',')
        .map(Number)
        .filter(value => value > 0),
    [searchParams],
  );

  const {
    data: paymentData,
    loading: paymentLoading,
    error: paymentError,
  } = useCommissionPayment(commissionPaymentId ?? 0, mode === 'edit');

  const companies = useLibsStore(s => s.companies);
  const currencies = useLibsStore(s => s.currencies);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);
  const { data: commissionInvoicesList } = useCommissionInvoices();

  const companyOptions = useMemo(() => recordToSelectData(companies), [companies]);
  const currencyOptions = useMemo(
    () => recordToSelectData(currencies),
    [currencies],
  );
  const defaultCurrencyId = useMemo(
    () => getDefaultEurCurrencyId(currencies),
    [currencies],
  );

  const form = useForm<CommissionPaymentFormValues>({
    initialValues: createEmptyCommissionPaymentFormValues(defaultCurrencyId),
    validate: {
      sellerId: value =>
        !value ? t('documents:documents.sellerRequired') : null,
      buyerId: value => (!value ? t('documents:documents.buyerRequired') : null),
      currencyId: value =>
        !value ? t('documents:documents.currencyRequired') : null,
    },
  });

  const [prefillDone, setPrefillDone] = useState(false);

  const commissionInvoiceOptions = useMemo(() => {
    const sellerId = form.values.sellerId
      ? Number(form.values.sellerId)
      : null;
    const buyerId = form.values.buyerId ? Number(form.values.buyerId) : null;
    const currencyId = form.values.currencyId
      ? Number(form.values.currencyId)
      : null;

    const fromList = (commissionInvoicesList ?? [])
      .filter(commission => {
        if (sellerId && commission.sellerId !== sellerId) return false;
        if (buyerId && commission.buyerId !== buyerId) return false;
        if (currencyId && commission.currencyId !== currencyId) return false;
        return true;
      })
      .map(commission => ({
        value: String(commission.id),
        label: `#${commission.id}`,
      }));

    const selectedIds = form.values.commissionPaymentLines
      .map(line => line.commissionInvoiceId)
      .filter((value): value is string => Boolean(value));

    const missing = selectedIds
      .filter(
        commissionId => !fromList.some(option => option.value === commissionId),
      )
      .map(commissionId => ({
        value: commissionId,
        label: `#${commissionId}`,
      }));

    return [...fromList, ...missing];
  }, [
    commissionInvoicesList,
    form.values.buyerId,
    form.values.commissionPaymentLines,
    form.values.currencyId,
    form.values.sellerId,
  ]);

  useEffect(() => {
    if (mode !== 'edit' || !paymentData) {
      return;
    }

    if (paymentData.status) {
      showError(t('documents:documents.cannotEditClosedCommissionPayment'));
      navigate(`${UrlConstants.COMMISSION_PAYMENTS_URL}/${paymentData.id}`);
      return;
    }

    form.setValues(commissionPaymentToFormValues(paymentData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentData, mode, navigate, t]);

  useEffect(() => {
    if (mode === 'edit' || prefillDone) {
      return;
    }

    const loadPrefill = async (): Promise<void> => {
      try {
        if (commissionInvoiceIds.length > 0) {
          const responses = await Promise.all(
            commissionInvoiceIds.map(commissionId =>
              CommissionInvoicesService.getById(commissionId),
            ),
          );
          form.setValues(
            prefillFromCommissionInvoices(responses, defaultCurrencyId),
          );
        }
      } catch {
        showError(t('common:messages.error'));
      } finally {
        setPrefillDone(true);
      }
    };

    if (!commissionInvoiceIds.length) {
      setPrefillDone(true);
      return;
    }

    void loadPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commissionInvoiceIds, defaultCurrencyId, mode, prefillDone, t]);

  const { loading: saving, mutateAsync: savePayment } = useMutation(
    async (values: CommissionPaymentFormValues) => {
      const validationError = validateCommissionPaymentForm(values);

      if (validationError === 'commissionPaymentLines') {
        throw new Error(t('documents:documents.commissionPaymentLinesRequired'));
      }

      if (validationError === 'required') {
        throw new Error(t('common:messages.error'));
      }

      if (mode === 'create') {
        return CommissionPaymentsService.create(
          formValuesToCreatePayload(values),
        );
      }

      return CommissionPaymentsService.update(
        commissionPaymentId!,
        formValuesToUpdatePayload(values),
      );
    },
    {
      onSuccess: result => {
        showSuccess(t('common:messages.saveSuccess'));
        navigate(`${UrlConstants.COMMISSION_PAYMENTS_URL}/${result.id}`);
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
          ? t('documents:documents.commissionPaymentCreate')
          : t('documents:documents.commissionPaymentEdit')
      }
      loading={saving}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(
          mode === 'edit' && commissionPaymentId
            ? `${UrlConstants.COMMISSION_PAYMENTS_URL}/${commissionPaymentId}`
            : UrlConstants.COMMISSION_PAYMENTS_URL,
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

      <CommissionPaymentLineEditor
        lines={form.values.commissionPaymentLines}
        onChange={commissionPaymentLines =>
          form.setFieldValue('commissionPaymentLines', commissionPaymentLines)
        }
        commissionInvoiceOptions={commissionInvoiceOptions}
        currencyLabel={currencyLabel}
      />
    </DocumentFormLayout>
  );
}

export function CommissionPaymentCreatePage(): ReactNode {
  return <CommissionPaymentFormPage mode='create' />;
}

export function CommissionPaymentEditPage(): ReactNode {
  return <CommissionPaymentFormPage mode='edit' />;
}
