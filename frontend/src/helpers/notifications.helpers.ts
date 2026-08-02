import { notifications } from '@mantine/notifications';

export function showSuccess(message: string): void {
  notifications.show({
    message,
    color: 'green',
  });
}

export function showError(message: string): void {
  notifications.show({
    message,
    color: 'red',
  });
}

export function showWarning(message: string): void {
  notifications.show({
    message,
    color: 'yellow',
  });
}
