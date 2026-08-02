import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group } from '@mantine/core';
import {
  IconArrowsExchange,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';

export function DocumentActions({
  loading = false,
  canEdit = true,
  canDelete = true,
  canChangeStatus = true,
  onEdit,
  onDelete,
  onChangeStatus,
}: {
  loading?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canChangeStatus?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onChangeStatus?: () => void;
}): ReactNode {
  const { t } = useTranslation(['common']);

  const hasActions = Boolean(onEdit || onDelete || onChangeStatus);

  if (!hasActions) {
    return null;
  }

  return (
    <Group gap='xs' justify='flex-end'>
      {onChangeStatus && (
        <Button
          variant='light'
          leftSection={<IconArrowsExchange size={16} />}
          onClick={onChangeStatus}
          loading={loading}
          disabled={!canChangeStatus}
        >
          {t('common:actions.changeStatus')}
        </Button>
      )}
      {onEdit && (
        <Button
          variant='light'
          leftSection={<IconPencil size={16} />}
          onClick={onEdit}
          loading={loading}
          disabled={!canEdit}
        >
          {t('common:actions.edit')}
        </Button>
      )}
      {onDelete && (
        <Button
          variant='light'
          color='red'
          leftSection={<IconTrash size={16} />}
          onClick={onDelete}
          loading={loading}
          disabled={!canDelete}
        >
          {t('common:actions.delete')}
        </Button>
      )}
    </Group>
  );
}
