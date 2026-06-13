import type { FormEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Group, Title } from '@mantine/core';

export function DocumentFormLayout({
  title,
  children,
  loading = false,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  title: string;
  children: ReactNode;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}): ReactNode {
  const { t } = useTranslation(['common']);

  return (
    <Card shadow='sm' p='md' radius='md' withBorder component='form' onSubmit={onSubmit}>
      <Title order={3} mb='md'>
        {title}
      </Title>

      {children}

      <Group justify='flex-end' mt='lg'>
        <Button variant='default' onClick={onCancel} disabled={loading} type='button'>
          {t('common:actions.cancel')}
        </Button>
        <Button type='submit' loading={loading}>
          {submitLabel ?? t('common:actions.save')}
        </Button>
      </Group>
    </Card>
  );
}
