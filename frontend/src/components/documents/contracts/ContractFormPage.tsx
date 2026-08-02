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
import { Grid, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { DocumentFormLayout } from '@/components/documents/common/DocumentFormLayout';
import { DocumentProductLineEditor } from '@/components/documents/common/DocumentProductLineEditor';
import { DocumentServiceLineEditor } from '@/components/documents/common/DocumentServiceLineEditor';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import {
  contractToFormValues,
  createEmptyContractFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
  getDefaultEurCurrencyId,
  validateContractForm,
} from '@/helpers/contracts-form.helpers';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useContract, useContracts } from '@/hooks/documents/useContracts';
import { useMutation } from '@/hooks/useMutation';
import { ContractsService } from '@/services/documents/contracts.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { ContractFormValues } from '@/types/documents/contracts.types';

type ContractFormMode = 'create' | 'edit';

export function ContractFormPage({ mode }: { mode: ContractFormMode }): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const parentIdParam = searchParams.get('parentId');
  const contractId = mode === 'edit' ? Number(id) : undefined;

  const {
    data: contractData,
    loading: contractLoading,
    error: contractError,
  } = useContract(contractId ?? 0, mode === 'edit');
  const { data: contractsList, loading: contractsListLoading } = useContracts();

  const companies = useLibsStore(s => s.companies);
  const currencies = useLibsStore(s => s.currencies);
  const incoterms = useLibsStore(s => s.incoterms);
  const isLibsLoaded = useLibsStore(s => s.isLoaded);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);

  const companyOptions = useMemo(() => recordToSelectData(companies), [companies]);
  const currencyOptions = useMemo(
    () => recordToSelectData(currencies),
    [currencies],
  );
  const incotermsOptions = useMemo(
    () => recordToSelectData(incoterms),
    [incoterms],
  );
  const parentContractOptions = useMemo(() => {
    if (!contractsList) {
      return [];
    }

    return contractsList.flatMap(contract => {
      const options = [
        { value: String(contract.id), label: contract.name },
        ...(contract.children ?? []).map(child => ({
          value: String(child.id),
          label: `- ${child.name}`,
        })),
      ];

      return options;
    });
  }, [contractsList]);

  const defaultCurrencyId = useMemo(
    () => getDefaultEurCurrencyId(currencies),
    [currencies],
  );

  const form = useForm<ContractFormValues>({
    initialValues: createEmptyContractFormValues(defaultCurrencyId),
    validate: {
      name: value => (!value.trim() ? t('documents:documents.contractNameRequired') : null),
      sellerId: value => (!value ? t('documents:documents.sellerRequired') : null),
      buyerId: value => (!value ? t('documents:documents.buyerRequired') : null),
      currencyId: value => (!value ? t('documents:documents.currencyRequired') : null),
    },
  });

  const [parentPrefillDone, setParentPrefillDone] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !contractData?.contract) {
      return;
    }

    if (contractData.contract.status) {
      showError(t('documents:documents.cannotEditClosed'));
      navigate(`${UrlConstants.CONTRACTS_URL}/${contractData.contract.id}`);
      return;
    }

    form.setValues(contractToFormValues(contractData.contract));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractData, mode, navigate, t]);

  useEffect(() => {
    if (mode !== 'create' || !parentIdParam || parentPrefillDone) {
      return;
    }

    const loadParent = async (): Promise<void> => {
      try {
        const parentData = await ContractsService.getById(Number(parentIdParam));
        const parent = parentData.contract;

        form.setValues({
          ...createEmptyContractFormValues(defaultCurrencyId),
          sellerId: String(parent.sellerId),
          buyerId: String(parent.buyerId),
          currencyId: String(parent.currencyId),
          vat: parent.vat ?? 0,
          paymentDelay: parent.paymentDelay ?? 0,
          incotermsId: parent.incotermsId ? String(parent.incotermsId) : null,
          transportPlace: parent.transportPlace ?? '',
          orderPrefix: parent.orderPrefix ?? '',
          parentId: String(parent.id),
          contractLines: parent.contractLines.map(line => ({
            productId: String(line.productId),
            packageId: String(line.packageId),
            qty: line.qty,
            shipQty: line.shipQty,
            price: line.price,
          })),
          contractServiceLines: (parent.contractServiceLines ?? []).map(line => ({
            serviceId: String(line.serviceId),
            qty: line.qty,
            price: line.price,
          })),
        });
        setParentPrefillDone(true);
      } catch {
        showError(t('common:messages.error'));
      }
    };

    void loadParent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCurrencyId, mode, parentIdParam, parentPrefillDone, t]);

  const { loading: saving, mutateAsync: saveContract } = useMutation(
    async (values: ContractFormValues) => {
      const validationError = validateContractForm(values);

      if (validationError === 'productLines') {
        throw new Error(t('documents:documents.productLinesRequired'));
      }

      if (mode === 'create') {
        return ContractsService.create(formValuesToCreatePayload(values));
      }

      return ContractsService.update(
        contractId!,
        formValuesToUpdatePayload(values),
      );
    },
    {
      onSuccess: result => {
        showSuccess(t('common:messages.saveSuccess'));
        navigate(`${UrlConstants.CONTRACTS_URL}/${result.id}`);
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

      void saveContract(form.values);
    },
    [form, saveContract],
  );

  const currencyLabel = form.values.currencyId
    ? getCurrencyName(Number(form.values.currencyId))
    : '';

  const isLoading =
    !isLibsLoaded ||
    contractsListLoading ||
    (mode === 'edit' && contractLoading) ||
    (mode === 'create' && Boolean(parentIdParam) && !parentPrefillDone);

  if (isLoading) {
    return <Spinner />;
  }

  if (mode === 'edit' && contractError) {
    return (
      <h3>
        {t('common:messages.error')} {contractError}
      </h3>
    );
  }

  return (
    <DocumentFormLayout
      title={
        mode === 'create'
          ? t('documents:documents.contractCreate')
          : t('documents:documents.contractEdit')
      }
      loading={saving}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(
          mode === 'edit' && contractId
            ? `${UrlConstants.CONTRACTS_URL}/${contractId}`
            : UrlConstants.CONTRACTS_URL,
        )
      }
    >
      <Grid gutter='md'>
        <Grid.Col span={6}>
          <TextInput
            label={t('tables:columns.name')}
            required
            {...form.getInputProps('name')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label={t('documents:documents.parentContract')}
            data={parentContractOptions}
            clearable
            searchable
            disabled={Boolean(parentIdParam)}
            {...form.getInputProps('parentId')}
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
            label={t('documents:documents.buyer')}
            data={companyOptions}
            required
            searchable
            {...form.getInputProps('buyerId')}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            label={t('documents:documents.currency')}
            data={currencyOptions}
            required
            searchable
            {...form.getInputProps('currencyId')}
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
            label={t('tables:columns.expirationDate')}
            valueFormat='DD.MM.YYYY'
            clearable
            {...form.getInputProps('term')}
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
            clearable
            searchable
            {...form.getInputProps('incotermsId')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            label={t('documents:documents.transportPlace')}
            maxLength={20}
            {...form.getInputProps('transportPlace')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            label={t('documents:documents.orderPrefix')}
            maxLength={6}
            {...form.getInputProps('orderPrefix')}
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

      <DocumentProductLineEditor
        lines={form.values.contractLines}
        onChange={lines => form.setFieldValue('contractLines', lines)}
        currencyLabel={currencyLabel}
      />

      <DocumentServiceLineEditor
        lines={form.values.contractServiceLines}
        onChange={lines => form.setFieldValue('contractServiceLines', lines)}
        currencyLabel={currencyLabel}
      />
    </DocumentFormLayout>
  );
}

export function ContractCreatePage(): ReactNode {
  return <ContractFormPage mode='create' />;
}

export function ContractEditPage(): ReactNode {
  return <ContractFormPage mode='edit' />;
}
