import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Grid, NumberInput, Select, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { DocumentFormLayout } from '@/components/documents/common/DocumentFormLayout';
import { Spinner } from '@/components/shared/Spinner';
import { CompanyType } from '@/constants/company-type.constants';
import { UrlConstants } from '@/constants/url-constants';
import {
  commissionInvoiceToFormValues,
  createEmptyCommissionInvoiceFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  getDefaultEurCurrencyId,
  prefillFromInvoice,
  validateCommissionInvoiceForm,
} from '@/helpers/commission-invoices-form.helpers';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useCommissionInvoice } from '@/hooks/documents/useCommissionInvoices';
import { useInvoices } from '@/hooks/documents/useInvoices';
import { useMutation } from '@/hooks/useMutation';
import { CommissionInvoicesService } from '@/services/documents/commission-invoices.service';
import { InvoicesService } from '@/services/documents/invoices.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { CommissionInvoiceFormValues } from '@/types/documents/commission-invoices.types';

export function CommissionInvoiceFormPage({
  mode,
}: {
  mode: 'create' | 'edit';
}): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const commissionId = mode === 'edit' ? Number(id) : undefined;
  const invoiceIdParam = searchParams.get('invoiceId');
  const prefillLocked = Boolean(invoiceIdParam) && mode === 'create';

  const {
    data: commissionData,
    loading: commissionLoading,
    error: commissionError,
  } = useCommissionInvoice(commissionId ?? 0, mode === 'edit');

  const companies = useLibsStore(s => s.companies);
  const companyTypes = useLibsStore(s => s.companyTypes);
  const currencies = useLibsStore(s => s.currencies);
  const isLibsLoaded = useLibsStore(s => s.isLoaded);
  const { data: invoicesList } = useInvoices();

  const commissionerOptions = useMemo(
    () =>
      Object.entries(companies)
        .filter(([companyId]) => companyTypes[Number(companyId)] === CompanyType.COMMISSIONER)
        .map(([companyId, name]) => ({
          value: companyId,
          label: name,
        })),
    [companies, companyTypes],
  );

  const companyOptions = useMemo(() => recordToSelectData(companies), [companies]);
  const currencyOptions = useMemo(
    () => recordToSelectData(currencies),
    [currencies],
  );
  const invoiceOptions = useMemo(
    () =>
      (invoicesList ?? []).map(invoice => ({
        value: String(invoice.id),
        label: invoice.invoiceNumber,
      })),
    [invoicesList],
  );

  const defaultCurrencyId = useMemo(
    () => getDefaultEurCurrencyId(currencies),
    [currencies],
  );

  const form = useForm<CommissionInvoiceFormValues>({
    initialValues: createEmptyCommissionInvoiceFormValues(defaultCurrencyId),
    validate: {
      sellerId: value =>
        !value ? t('documents:documents.sellerRequired') : null,
      buyerId: value => (!value ? t('documents:documents.buyerRequired') : null),
      invoiceId: value =>
        !value ? t('documents:documents.invoiceNumberRequired') : null,
      currencyId: value =>
        !value ? t('documents:documents.currencyRequired') : null,
      rate: value =>
        !value || value <= 0 ? t('documents:documents.rateRequired') : null,
    },
  });

  const [prefillDone, setPrefillDone] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !commissionData) {
      return;
    }

    if (commissionData.status) {
      showError(t('documents:documents.cannotEditClosedCommissionInvoice'));
      navigate(`${UrlConstants.COMMISSION_INVOICES_URL}/${commissionData.id}`);
      return;
    }

    form.setValues(commissionInvoiceToFormValues(commissionData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commissionData, mode, navigate, t]);

  useEffect(() => {
    if (mode === 'edit' || prefillDone) {
      return;
    }

    const loadPrefill = async (): Promise<void> => {
      try {
        if (invoiceIdParam) {
          const invoiceData = await InvoicesService.getById(
            Number(invoiceIdParam),
          );
          form.setValues(
            prefillFromInvoice(invoiceData.invoice, defaultCurrencyId),
          );
        }
      } catch {
        showError(t('common:messages.error'));
      } finally {
        setPrefillDone(true);
      }
    };

    if (!invoiceIdParam) {
      setPrefillDone(true);
      return;
    }

    void loadPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCurrencyId, invoiceIdParam, mode, prefillDone, t]);

  const { loading: saving, mutateAsync: saveCommission } = useMutation(
    async (values: CommissionInvoiceFormValues) => {
      const validationError = validateCommissionInvoiceForm(values);

      if (validationError === 'rate') {
        throw new Error(t('documents:documents.rateRequired'));
      }

      if (validationError === 'required') {
        throw new Error(t('common:messages.error'));
      }

      if (mode === 'create') {
        return CommissionInvoicesService.create(
          formValuesToCreatePayload(values),
        );
      }

      return CommissionInvoicesService.update(
        commissionId!,
        formValuesToUpdatePayload(values),
      );
    },
    {
      onSuccess: result => {
        showSuccess(t('common:messages.saveSuccess'));
        navigate(`${UrlConstants.COMMISSION_INVOICES_URL}/${result.id}`);
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
    void saveCommission(form.values);
  };

  const isLoading =
    !isLibsLoaded ||
    (mode === 'edit' && commissionLoading) ||
    (mode === 'create' && !prefillDone);

  if (isLoading) {
    return <Spinner />;
  }

  if (mode === 'edit' && commissionError) {
    return (
      <h3>
        {t('common:messages.error')} {commissionError}
      </h3>
    );
  }

  return (
    <DocumentFormLayout
      title={
        mode === 'create'
          ? t('documents:documents.commissionInvoiceCreate')
          : t('documents:documents.commissionInvoiceEdit')
      }
      loading={saving}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(
          mode === 'edit' && commissionId
            ? `${UrlConstants.COMMISSION_INVOICES_URL}/${commissionId}`
            : UrlConstants.COMMISSION_INVOICES_URL,
        )
      }
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('documents:documents.recipient')}
            data={commissionerOptions}
            searchable
            {...form.getInputProps('sellerId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('documents:documents.payer')}
            data={companyOptions}
            searchable
            disabled={prefillLocked || mode === 'edit'}
            {...form.getInputProps('buyerId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('documents:documents.byInvoice')}
            data={invoiceOptions}
            searchable
            disabled={prefillLocked || mode === 'edit'}
            {...form.getInputProps('invoiceId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            label={t('documents:documents.currency')}
            data={currencyOptions}
            searchable
            disabled={prefillLocked}
            {...form.getInputProps('currencyId')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <NumberInput
            label={t('documents:documents.rate')}
            min={0}
            decimalScale={2}
            suffix=' %'
            {...form.getInputProps('rate')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DateInput
            label={t('documents:documents.createdAt')}
            valueFormat='DD.MM.YYYY'
            {...form.getInputProps('creationDate')}
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
    </DocumentFormLayout>
  );
}

export function CommissionInvoiceCreatePage(): ReactNode {
  return <CommissionInvoiceFormPage mode='create' />;
}

export function CommissionInvoiceEditPage(): ReactNode {
  return <CommissionInvoiceFormPage mode='edit' />;
}
