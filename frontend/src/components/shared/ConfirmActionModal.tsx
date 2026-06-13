import type { ReactNode } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';

export function ConfirmActionModal({
  opened,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmColor = 'blue',
  loading = false,
  onConfirm,
  onCancel,
}: {
  opened: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmColor?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}): ReactNode {
  return (
    <Modal opened={opened} onClose={onCancel} title={title} centered>
      <Text size='sm' mb='lg'>
        {message}
      </Text>
      <Group justify='flex-end'>
        <Button variant='default' onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button color={confirmColor} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}
